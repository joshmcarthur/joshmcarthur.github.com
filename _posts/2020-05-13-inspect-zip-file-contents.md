---
layout: post
title: "Inspect zip file contents"
description: "A handy way to quickly inspect the contents of a zip file"
category: TIL
tags: [til,technology]
---

If you've got a large zipfile, or just a badly named one and you'd like to quickly take a peek at what's inside it, 
there's a handy flag that can be passed to the `unzip` utility (`apt install unzip`):

`unzip -vl path_to_zip.zip`

This yields an output like:

```
root@224cb547fae0:/usr/src/app# unzip -vl spec/fixtures/example.zip
Archive:  spec/fixtures/example.zip
 Length   Method    Size  Cmpr    Date    Time   CRC-32   Name
--------  ------  ------- ---- ---------- ----- --------  ----
      12  Defl:N       14 -17% 2019-01-08 03:33 d0985364  Example File.txt
       0  Stored        0   0% 2019-01-08 03:33 00000000  __MACOSX/
     570  Defl:N      417  27% 2019-01-08 03:33 c696190f  __MACOSX/._Example File.txt
--------          -------  ---                            -------
     582              431  26%                            3 files
```

This shows the file size, the compression algorithm, and the mtime, all without bothering with a UI or extracting to a tempdir. Handy!
