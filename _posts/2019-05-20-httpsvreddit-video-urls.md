---
layout: post
title: "https://v.redd.it video URLs"
description: "How to get to video & audio download URLs from a https://v.redd.it URL"
category: TIL
tags: [til,technology]
---

A couple of years ago, Reddit added support for video and gif hosting - basically in response to
competition from Imgur and Giphy taking visitors offsite. 

This service works well, but they have been to some trouble to obfuscate things and make it a little
hard to get to the raw video file - I guess to prevent hotlinking to try and direct visitors towards
the actual post instead (with accompanying advertisements). Right-clicking to save a video from a
post page won't work either, since the video file isn't referenced directly. Instead, they seem to
be fetching the video and audio streams as a `Blob`, and using that as the video source. Sneaky!

If you are after that perfect cat video for your permanent archive though, you probably ARE after
the video file. Getting it isn't hard, once the technique is known.

**TL;DR - this post details how to get each individual part of a video. If you just want the video,
[`youtube-dl`](https://ytdl-org.github.io/youtube-dl/index.html) will do the job nicely.**

The first thing to know is that the transcoding process that v.redd.it videos go through splits the
video from the audio (if any). If a video _does_ have audio, you will consistently find it at
`https://v.redd.it/{id}/audio`. If a video does not have audio, you'll get a 403 error page that
looks suspiciously like that of an S3 bucket.

The second thing to know is the presence of a very handy file - the DASH playlist. This file can
consistently be found at `https://v.redd.it/{id}/DASHPlaylist.mpd`. The playlist is an XML file
listing all the 'representations' of a video. A representation is either an audio or video feed, and
in this way can support different video resolutions and AV formats. As I mentioned above,
Reddit-transcoded videos consistently have zero or one audio feeds in mp4a format, and a range of
different resolution videos feeds - 240p, 360p, 720p, etc.

This XML file contains a number of `RepresentationElement` tags, which each of these containing a
`BaseURL`. The content of the `BaseURL` tag can be appended to the `https://v.redd.it/{id}` URL to
actually load the video stream, for example:

From `https://v.redd.it/xcre0omf86j21/DASHPlaylist.mpd`, we see that there are 5 video streams
available, and 1 audio stream. By looking out at the BaseURL tag (or automating this with something
like
[`xmllint`](https://www.joshmcarthur.com/til/2018/06/19/extracting-xml-data-with-curl-and-xmllint.html),
we derive the following video URLs:

1. `https://v.redd.it/xcre0omf86j21/DASH_720`
1. `https://v.redd.it/xcre0omf86j21/DASH_1080`
1. `https://v.redd.it/xcre0omf86j21/DASH_480`
1. `https://v.redd.it/xcre0omf86j21/DASH_360`
1. `https://v.redd.it/xcre0omf86j21/DASH_240`

And the audio URL:

1. `https://v.redd.it/xcre0omf86j21/audio`

And that's all there is to it! As I said at the start of this post, if you're just after a video,
`youtube-dl` is the better solution. It'll do all this fetching and parsing for you, and will even
select the highest-resolution video and re-mux the audio track back into the MP4 file.
