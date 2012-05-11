---
title: A handy tip
layout: post

type: regular
comments: true
---

Just FYI...
See 2 posts ago - I am modifying this theme to make it work a bit nicer. Part
of this included wanting to change some images. I was trying to just link to
the images in CSS, but I found a much nicer way of doing it.
If you want to change your theme currently, you can often change a range of
colors. There is a technique that allows you to prompt the user to upload an
image file, rather than choosing a file:
First, set up the parameter that the settings drop down will look for by making
a meta tag in the document head that has it's name set as "image:
YourTemplateImage", and the content set as the link to the image that should be
used as default.
You can then use this image by referring to it in your CSS or HTML - for
example:
#content { background: #FFF url({image:YourTemplateImage}) no-repeat top left;
}
Very nice! Cheers to this_blog_post for the link.

