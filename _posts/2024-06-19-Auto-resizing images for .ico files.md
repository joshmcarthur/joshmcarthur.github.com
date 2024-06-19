---
title: Auto-resizing images for .ico files using ImageMagick
---

There's a bit of a mystery about [how relevant](https://stackoverflow.com/questions/48956465/favicon-standard-2024-svg-ico-png-and-dimensions) favicon.ico files are in 2024. Like it not though, they are the lowest common denominator, so they still have some use.

Today I learned about a handy option that can be passed to ImageMagick that will automatically resize a source into a range
of common dimensions to be packed into an ico file.

Given a source file, say `favicon.svg`, which is, say, a vector image, the following command generates a favicon.ico:

```sh
convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize -colors 256 favicon.ico
```

Source: https://gist.github.com/azam/3b6995a29b9f079282f3

> This will also work with a non-vector image source, like a PNG, in which case I believe the density argument is not needed.

The favicon by default resizes to 256, 192, 128, 96, 64, 48, 40, 32, 24 and 16px variants:

```sh
❯ identify favicon.ico
favicon.ico[0] PNG 256x256 256x256+0+0 8-bit sRGB 38282B 0.000u 0:00.002
favicon.ico[1] ICO 192x192 192x192+0+0 8-bit sRGB 0.000u 0:00.002
favicon.ico[2] ICO 128x128 128x128+0+0 8-bit sRGB 0.000u 0:00.001
favicon.ico[3] ICO 96x96 96x96+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[4] ICO 64x64 64x64+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[5] ICO 48x48 48x48+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[6] ICO 40x40 40x40+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[7] ICO 32x32 32x32+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[8] ICO 24x24 24x24+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[9] ICO 16x16 16x16+0+0 8-bit sRGB 337400B 0.000u 0:00.000
```

The `-define` option does accept arguments though, so you can resize to a different range or subset:

```sh
convert -density 256x256 -background transparent favicon.svg -define icon:auto-resize=32,16 -colors 256 favicon.ico

identify favicon.ico
▶ identify favicon.ico
favicon.ico[0] ICO 32x32 32x32+0+0 8-bit sRGB 0.000u 0:00.000
favicon.ico[1] ICO 16x16 16x16+0+0 8-bit sRGB 5430B 0.000u 0:00.000
```

This can be useful if you don't need all the predefined sizes, since the resulting file will be much smaller.