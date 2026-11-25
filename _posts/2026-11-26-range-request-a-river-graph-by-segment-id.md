---
title: Range-request a river graph by segment id
category: TIL
---

I recently published a mini-project called [Headwaters](https://headwaters.joshmcarthur.com) that highlights
the path of any waterway in New Zealand from source to sea, as well as showing the upstream tributaries of the tapped point.

The source data for this project was a geodatabase file published by NIWA (now Earth Sciences NZ). This format is completely fine for local geospatial work, but unsuitable for web visualisation, since it
requires loading the entire dataset into memory.

For NZ, I converted the geodatabase to a [PMTiles](https://github.com/protomaps/PMTiles) file, which is a compact, indexed format for map tiles. PMTiles works by the client using a Range header to request a specific range of bytes from the single file to load only the tiles that are needed for the current view. I've used this format for my own projects before, and it's a great way to serve map tiles from a static host, which is how I prefer to build nearly all of my projects - it has a much lower cost and maintenance burden with much greater cacheability, performance, and I can host it at home.

The lines on the map are only half of it, though. To highlight a river I need the topology: which segment flows into which. I'll use a tiny river as the example for the rest of this post. Two creeks (segments 1 and 4) join to form segment 2, which flows into segment 3, which reaches the sea:

```
1 ──┐
    ├──> 2 ──> 3 ──> sea
4 ──┘
```

I packed that into a separate binary file, `reaches.bin`, with one 12-byte row per segment: its id, the id of the segment downstream (0 for the sea), and its length in metres. Names went in a string table after the rows.

| id | down | length |
|----|------|--------|
| 1  | 2    | 10     |
| 2  | 3    | 20     |
| 3  | 0    | 30     |
| 4  | 2    | 5      |

Each row only points downstream, so the browser downloaded the whole file and flipped it into an upstream index in memory:

```
2 ← 1, 4
3 ← 2
```

From then on every tap was a walk through those two lookups. Tap segment 2 and you follow `down` to get 3, then the sea, and you follow the upstream index to get 1 and 4. New Zealand's file was about 8 MB, which was fine.

## Adding Australia

Once I finished New Zealand, I added Australia from the Bureau of Meteorology's Geofabric. Everything got bigger. The PMTiles file grew a lot, but that didn't really matter: the client still only asks for the tiles in the viewport, and tippecanoe drops the smaller streams at low zoom levels, so a zoomed-out view of the whole continent is a coarse subset.

The topology file was the problem. Australia has about 2.6 million segments, and the packed file came to about 36 MB (21 MB gzipped). That's surprisingly small for millions of connections, but it's still a lot to download before the map is usable, and then a lot to hold in memory on a phone or an older laptop. The map waited for it before it even drew.

## Why not PMTiles for the topology too?

My first thought was to put the graph in PMTiles as well, since the Range trick was already working for the lines. The client looks up a tile, sends `Range: bytes=start-end`, and gets a 206 back with just that slice.

The trouble is that PMTiles is indexed by zoom/x/y, and a tap isn't a place on the map. I needed to ask for connections, not tiles. A tap starts from a segment id (`nzsegment` in New Zealand, `HydroID` in Australia) and wants that segment's tributaries plus the run downstream to the mouth. A long river crosses a lot of tiles, and each of those tiles is full of segments from other catchments, so I'd end up downloading far more data than the river actually needs, then unpacking it all into the same in-memory index I was trying to avoid.

## Indexing by segment

So I rebuilt `reaches.bin` around the same idea as PMTiles (one static file, a small directory up front, Range requests for the rest), with a segment id as the key instead of a tile.

The file starts with a 64-byte header and a lookup table of sorted segment ids. Each id points at two slices of the file. The first is the segment's tributaries and the second is its path to the mouth.

For the tributaries, the segments are written out depth-first, starting at the sea and working upstream, with the number of segments in each subtree:

| position | id | subtree size |
|----------|----|--------------|
| 0        | 3  | 4            |
| 1        | 2  | 3            |
| 2        | 1  | 1            |
| 3        | 4  | 1            |

Depth-first order means everything upstream of a segment sits right after it. Segment 2 is at position 1 with a subtree of 3, so its tributaries are positions 1 to 3: segments 2, 1, and 4. That's one contiguous run of bytes, so it's one Range request, however many tributaries there are.

The path to the mouth uses a second copy of the same segments, ordered into long chains that run downstream. Each row records where its chain ends and the position of the segment it drains into:

| position | id | chain ends at | drains into |
|----------|----|---------------|-------------|
| 0        | 1  | 3             | 1           |
| 1        | 2  | 3             | 2           |
| 2        | 3  | 3             | sea         |
| 3        | 4  | 4             | 1           |

Tap segment 4 and the lookup table says it's at position 3. That chain is just segment 4, and it drains into position 1. Read from position 1 to the end of that chain and you get segments 2 and 3, then the sea. On a real river the chains are long, so the walk to the mouth is a handful of reads rather than one per segment.

The lookup table ties it together, with each id pointing at its position in both copies:

| id | tributaries at | path at | subtree size |
|----|----------------|---------|--------------|
| 1  | 2              | 0       | 1            |
| 2  | 1              | 1       | 3            |
| 3  | 0              | 2       | 4            |
| 4  | 3              | 3       | 1            |

The table is split into pages of 1,024 ids, with a small directory of the first id on each page, so a tap only needs the directory and one page. Altogether, a tap reads the header, one page of the lookup table, then those two slices. I request 16 KiB aligned blocks rather than the exact bytes, so a tap on a nearby segment can reuse a block that's already cached:

```ts
const res = await fetch(`${url}?hwb=${page}`, {
  headers: { Range: `bytes=${page}-${page + 16383}` },
  cache: "no-store",
});
```

Storing every segment twice, once in each order, makes the file bigger on disk (Australia's is now about 165 MB), but the browser never downloads the whole thing. It loads the part of the file for the segment you tapped, and nothing else.

I backported this to New Zealand as well. Even with the smaller dataset it's noticeably quicker, because the map no longer waits for the topology before it appears. It's ready as soon as the tiles are, and the first tap only fetches a few blocks.

## The Murray

Big catchments still need a lot of data. The Murray is Australia's longest river. It rises in the Australian Alps, runs along most of the border between New South Wales and Victoria, then crosses into South Australia and reaches the sea through Lake Alexandrina. Tap near the mouth and you're asking for most of the Murray–Darling Basin: about 287,000 segments upstream of that point. Everything is just bigger in Australia (rivers, catchments, spiders). The difference now is that the map stays usable while that loads, and the blocks are cached, so the next tap in the same basin is quick.
