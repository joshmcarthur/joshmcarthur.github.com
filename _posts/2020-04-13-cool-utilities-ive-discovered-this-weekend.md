---
layout: post
title: "Cool utilities I've discovered this weekend"
description: ""
category: 
tags: []
---

### `bat`

`bat` is `cat` with syntax highlighting, but is still compatible with pipes, etc. Really neat. I like the filename header.

Github: [https://github.com/sharkdp/bat](https://github.com/sharkdp/bat)

### `jira`

A CLI for Jira. Maybe it'll be faster than using the web interace???

Regardless, it supports a fancy config loading system that looks like I can configure it as part of my `tmux` setup
to pop me into the correct project for the directory I'm in.

[https://github.com/go-jira/jira](https://github.com/go-jira/jira)

### `entr`

A really nice tool in the UNIX philosphy of building simple, composible command line utilities.
`entr` can be piped to to run a command when the stream on the left hand side changes. This is
similar functionality to `guard`, `livereload`, etc, but is useful precisely because it is generic.

It also has a handy option for commands that don't support signals or a modified stream &emdash; `-r` will
cause `entr` to terminate the process and start it again, rather than trying to 'hot reload'.

The website has heaps of examples with documentation on the additional options: [http://eradman.com/entrproject/](http://eradman.com/entrproject/)

### TLDR pages

TLDR pages aim to extend on `man` pages with practical examples of common tasks. The website, https://tldr.sh/ is
usable as-is, but there are a bunch of command-line tools available. I'm trying to Node.js version, but there are 
various options depending on the runtimes you have installed.

[https://tldr.sh/](https://tldr.sh/)
