---
layout: post
title: "Automatic text wrapping in vim"
description: "Having text wrap onto a new line in vim is handy for authoring emails, blog posts and other content"
category: TIL
tags: [til,vim,tooling]
---

This is something I use all the time. I don't have it in my `~/.vimrc` yet - partially because I
haven't got around to it, partially because I sometimes want to use different line lenghts, and
partially because I don't want to bikeshed myself trying to decide on what line length I want for
different file formats.

Vim supports soft wrapping, which is something a bit different - it only affects the display of the
line, not the actual line length. Softwrap is great for scripting or programming, where a line break
in the wrong place might have a negative impact on your ability to actually compile and/or run the
file!

Hard wrapping actually adds line break characters when the line exceeds a number of characters, and
is therefore great for git commit messages, emails, blog posts, letters, and any other contexts
where actual content is being written. 

To set a hard wrap at a particular character length, simply run `set tw={{line length}}` within a
vim window. Don't forget to use the ':' character to enter into the appropriate mode (I think this
is called 'command mode'?) before running this. I usually use one of the following settings:

* `set tw=80`
* `set tw=100`
* `set tw=120`

- trending towards shorter lines for things like git commit messages, and longer lines for longform
  content like a blog post. When the line character count reaches the wrap limit you have set, it
  will automatically drop onto a new line, increasing the line count in the gutter on the left.

  ![tw demo](http://g.recordit.co/DmJnHaaUtz.gif)
