---
layout: post
title: "UNIX find case insensitive"
description: "Quick tip on how to find by name case-insensitively"
category: TIL
tags: [til,shell]
---

I use the [`find`](http://man7.org/linux/man-pages/man1/find.1.html) all the time to
(unsurprisingly), _find_ files or directories I'm looking for. I prefer it to any UI built into my
OS (currently Ubuntu, but all OSes seem to have this kind of thing - Alfred/Spotlight/Start Menu
etc), because I usually know roughly where I'm looking, and I can be declarative about what I'm
looking for (e.g. _file_ that starts with _x_ and has the extension _.blah_).

Today I learned that the `find` option I use all the time, `-name`, has a case-insensitive version.
I can't believe I didn't try and guess this earlier, but that option would be `-iname`. This option
has identical behaviour to the standard, but doesn't match on case. This means that wildcards like
`*` can still be used, but the terms included in the search string can be in any case - upper,
lower, or mixed.

I came across this because I was attempting to export my highlights from my Kindle. After some
research, I discovered that highlights are stored on a Kindle in `documents/my-clippings.txt`.
Great! Except..I have many, many files in that folder. I first used `find . -type f -name
'*clippings*'` to find it...that didnt' match anything. I was then able to use `-iname '*clipping*'` where I _did_ find it - named "My Clippings.txt".

Because I used the wildcard in my term, I also found an additional file I can now looking into - "My
Clippings.sdr".

