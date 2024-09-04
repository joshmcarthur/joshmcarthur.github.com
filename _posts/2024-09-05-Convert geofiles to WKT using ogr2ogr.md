---
title: Converting geofiles to WKT using ogr2ogr
---

I _love_ gdal, particularly ogr2ogr. Like `ffmpeg`, and `convert`, it's just one
of those convert anything to anything commands that is so handy to know about.

ogr2ogr is part of the GDAL library, and is particularly suited to converting
files containing geospatial data from one source to another. I often use this
tool to convert shapefiles into GeoJSON for example, load data into Spatialite
or PostGIS, or use query and filter operations to reduce a result set into a
smaller file.

I built, and operate, an application (web + iOS) called
[Virtualtrails](https://virtualtrails.app). This application integrates with a
bunch of fitness platforms to track the distance travelled by walking, running,
or using a wheelchair, and then superimposes that distance onto a trail from New
Zealand and around the world. Along the way, points of interest are virtually
reached and unlocked, and so it's a really fun way to both meet fitness
objectives and find out more about a trail.

I create all the trail content myself, but often trail geospatial paths need to
get stitched together from a number of sources. Sometimes they are published in
geospatial formats already (typically a GPX or KML) file, other times I need to
trace the route myself to get the geospatial data. Unsurprisingly, with route
data coming from so many sources, `ogr2ogr` regularly features in my route prep
process.

Today I found a nice shortcut to prepare route data, which is to leverage an
option to `ogr2ogr`'s CSV format export that exports data in well-known text
(WKT). WKT is particuarly useful to me because it's a text format which
[rgeo](https://gem.wtf/rgeo) natively supports - I use rgeo to transform
geospatial data to and from Ruby objects, including database persistence in
native PostGIS types. Before I discovered this option, I used to have to
manually apply some find and replace operations in my editor to convert a format
that was _close_ to WKT like GeoJSON or KML to WKT.

The option is passed using `-lco`, which are format input flags. Here's an
example:

```bash
ogr2ogr -f CSV output.csv input[.geojson, .kml, .shp, etc] -lco GEOMETRY=AS_WKT
```

The output CSV will export one row per feature, with a header column of 'WKT'.
If your input format features have attributes, these will also be included as
features.

```csv
WKT
"LINESTRING Z (174.235252414479 -41.0947374817005 0,174.234414785847 -41.0946484189218 0,174.2339359575 .... )"
```

Because this process is part of ogr2ogr, it's also no longer necessary for me to
convert from a complex format like a shapefile to a text format like GeoJSON -
because ogr2ogr is converting to CSV anyway, it will accept any input file it
supports (and it supports _loads_) - this can include operations like filtering,
stripping or converting attributes, or reprojection, if I need.

A handy find!
