---
layout: post
title: "Paste mode in VIM"
description: "How to paste formatted code in vim"
category: TIL
tags: [til, technology, tooling]
---

A VIM mode I did not know about for quite some time during my VIM usage is "paste" mode. This mode
doesn't do much, but is invaluable if you are moving code around, copy and pasting between files
outside vim.

Paste mode can be activated using `set :paste` and deactivated with `set :nopaste`. This mode by
default simply deactivates autoindentation, which means that the existing format of the text being
pasted will be respected. 

This is a very simple and handy trick to keep in mind, as it saves auto-indent picking up the wrong
spacing and incorrectly applying "fixes" which often need to be manually fixed up.
