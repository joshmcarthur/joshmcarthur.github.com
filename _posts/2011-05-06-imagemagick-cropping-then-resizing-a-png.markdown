---
title: "ImageMagick: Cropping then Resizing a PNG"
layout: post
tags:
  - mini_magick
  - image_magick
  - png
  - image resizing

type: regular
comments: true
---

I've been working on an image processor class for work, and recently ran into
this issue. I thought I would post it up here as normally I need to be quite
desperate before I start trawling through email mirrors - hopefully somebody
comes across this post first.
If you use ImageMagick (in particular, in conjunction with MiniMagick), then
you may come across this issue, and there is actually a quick fix to it. The
issue itself is as follows: my image processor retrieves an image from an
online source, but the image has a 1 or 2px border, and is thousands of pixels
wide - too wide for web use. I therefore wrote this class to first crop the
border off the image, and then resize it.
If you do actually do this though, there is an important step that needs to go
in-between the cropping and the resizing. If you won't do this, you will
basically get a PNG layer that is offset from the image itself - i.e. some or
all of the Â actual image content is not visible. This happens because when the
image is cropped, the origin of the image changes. It needs to be reset back to
coordinates 0, 0 in order to not offset the layer itself when the image is
resized.
Here's how to do it.Â 
For Ruby/Minimagick:
image.set("page", "#{image['width']}x#{image['height']}+0+0")
For ImageMagick directly (i.e. in console):
convert [image sequence]: -set page [width]x[height]+0+0
Simple! The image should save correctly.

