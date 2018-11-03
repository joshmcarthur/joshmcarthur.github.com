---
layout: post
title: "Open all files as tabs in in vim"
description: "Quickly transform a shell list of files into tabs"
category: TIL
tags: [til,technology,vim,tools]
---

Just a quick trick I learned yesterday: I often glob files into `vim` from my terminal to view them
quickly - for example, given the following files exist:

```
> ls 
file1.txt
file2.txt
file3.txt
```

When I run: `vim *.txt`

Then I expect `file1.txt`, the first file, to be opened

When I run the command `:tab all` within `vim` 

I then see a tab for each file I have opened:

![Tabs in vim](/img/posts/open-all-files-as-tabs-in-vim-1.png)

This is a very nice shortcut that I expect to use often!
