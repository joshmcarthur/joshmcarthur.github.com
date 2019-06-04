---
layout: post
title: "tmux system clipboard copy & paste on Mac OS"
description: "How to set up tmux >2.8 for system clipboard copy and paste on Mac OS"
category: TIL
tags: [til,technology,shell]
---

I have recently begun using [tmux](https://en.wikipedia.org/wiki/Tmux) as part of my everyday
development process. It's going great, but as somebody who uses a mixture of Mac OS applications
like VS Code as well as terminal applications like `git`, `vim`, `tail`, `cat`, etc., the lack of
system clipboard integration has really been hurting.

I went out and did some research into how I can set tmux up to copy to the system clipboard, and
first found that support for piping copied content was added in Tmux 1.8 via the `copy-pipe`
command, and then found a [blog post by
Thoughtbot](https://thoughtbot.com/blog/tmux-copy-paste-on-os-x-a-better-future)  (of course!), that outlined how to set up
`copy-pipe` to use the Mac OS clipboard shell integration command, `pbcopy`. 

Unfortunately, the Thoughtbot post was written in 2013, and since then, the syntax for defining
keybindings has changed somewhat - hence this post.

**This is the configuration that works for me on Tmux 2.8 that integrates Tmux copy operations with
the Mac OS system keyboard:**

In `~/.tmux.conf`:

```
# Vim mode
setw -g mode-keys vi

# Setup 'v' to begin selection as in Vim
bind-key -T copy-mode-vi v send-keys -X begin-selection
bind-key -T copy-mode-vi y send-keys -X copy-pipe "reattach-to-user-namespace pbcopy"

# Update default binding of `Enter` to also use copy-pipe
unbind -T copy-mode-vi Enter
bind-key -T copy-mode-vi Enter send-keys -X copy-pipe "reattach-to-user-namespace pbcopy"
```

The key changes are:

* `-t vi-copy` to `-T copy-mode-vi`
* `send-keys -X` now needs to be added between the keyboard shortcut and the 'command'.

I am still trying to figure out how to integrate this copy operation with mouse support, however I
have verified that the vim keyboard shortcuts in tmux 'visual mode' now copy to the clipboard as I
expect.

