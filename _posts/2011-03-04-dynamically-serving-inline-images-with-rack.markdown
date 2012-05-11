---
title: Dynamically Serving Inline Images with Rack
layout: post

type: regular
comments: true
---

Following an insanely interesting presentation by Steve Souders at Webstock, I
began thinking about ways to simplify (i.e. automate) certain processes to
optimize performance of sites. Something that immediately jumped out at me from
early on in Steve's workshop (So early, I was able to start coding in the
halfway break), was that inline images were an ideal candidate for something
that is relatively easy to do, but could have a significant effect on overall
page load speed.
The concept of inline images has been around for a while, and basically
involves embedding Base64-encoded image data within the image tag like so:
<img src="data:image/jpeg;base64,[data] />
So, what impact does this have on performance vs. the normal technique?
Well, the normal technique involves several more requests - one per image, in
fact. As Steve pointed out in his workshop, server response time is only a
small part of the problem - the reality is that it doesn't make a huge
difference how fast a piece of content is processed on the server - unless you
are doing something really wrong, of course. Where you can really hit
performance bottlenecks is actually in the request-response transaction -
waiting for data to be transmitted, received, processed, assembled, and
rendered on screen.
Using inline images can improve web performance when used appropriately, but as
with any other performance technique, it has it's drawbacks. First of all,
because the images are actually embedded into the page, caching is affected -
browsers may cache images longer than static pages, and if your web server is
not set up correctly, dynamic pages may not be cached at all. Next, the
relative file size of the page is not equal to the page size without images
plus the combined images file size. The encoding process tends to result in
about a 30% increase in size.
Notice above I have said when used appropriatelyÂ - this means that, despite
the drawbacks above, it really can help web performance. The key to not
overusing this technique is to carefully consider the boundaries of what images
should be embedded - the best candidates are small to medium sized images that
do not generally change much - especially if there are quite a few of them on
the page and the server is slow - this means that your page load speed might be
slower, but there will also be no need to make several requests once the page
hasÂ loaded to draw in all of these assets. Large images, on the other hand,
should not generally be encoded. There is a fine balance between embedding
images into a page to save on requests, and overloading the page with embedded
images and ending up with a 2 or 3 megabyte page for the client to load. Large
images will shove up this page size, and in addition to this, they are usually
particular files that you want to apply a different caching policy to anyway.
In order to help out and generally feel good about my contributions to web
performance and open source, I have actually translated what I've written down
here into a piece of Rack middleware that creates inline images (Since I've
come across rack-pagespeedÂ since then, this middleware is probably
superseded), and embeds them into a page. This technique was nice because a) It
gave me a chance to learn how Rack middleware works with a practical project,
and b) because when myself or others wish to use it, all that needs to be done
is to drop the Gem into my Gemfile, run bundle install, and register the
middleware in my Application's configuration - from there on, the middleware
will automatically parse responses from the Rails (Or any Rack-compatible
application, actually), and replace the <img src="file.jpg"> with encoded data.
Overall, this technique is not perfect - it's definitely not something to be
overused, but with careful consideration and appropriate selection of images
it's a good stepping stone to improved web performance.

