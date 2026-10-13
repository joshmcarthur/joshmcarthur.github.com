---
title: Serve Active Storage SVGs as images, not as binary
category: TIL
---

Last night, I was building a print view for physical sticker tags, which
included rendering SVG assets uploaded to ActiveStorage. I ran into a problem
I've run into a few times before but haven't written about yet when I added the
uploaded SVG into a `<img>` tag, the browser downloaded the file instead of
showing it. When I checked the network tab, I saw that the blob URL had a
`Content-Disposition: attachment` header, and was being served as
`application/octet-stream`, so the browser was treating it as a download.

Active Storage keeps `image/svg+xml` in `content_types_to_serve_as_binary`. SVG
can include script, so Rails serves the blob as `application/octet-stream` with
`Content-Disposition: attachment` by default.

If you understand the risk profile of SVG and want to serve it as an image, you
can configure ActiveStorage to serve it as an image instead of a binary:

```ruby
# config/application.rb
config.active_storage.content_types_to_serve_as_binary -= ["image/svg+xml"]
```

The blob then keeps `image/svg+xml`, and an `<img>` can display it.

This is a different SVG issue to [re-enabling the libvips SVG
loader](https://www.joshmcarthur.com/til/2026/08/02/re-enable-svg-after-rails-blocks-untrusted-libvips-loaders.html)
after the Active Storage vips advisory. That one is converting SVG. This one is
serving it. If you're handling SVG ActiveStorage blobs, you're likely to need to
consider both.

> **Note** Only do this for low-risk, trusted files. In this case, the SVGs are
> seeded from an asset catalog, not user uploads, so I consider this safe for my
> purposes.
