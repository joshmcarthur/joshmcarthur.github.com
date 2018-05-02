---
layout: post
title: "What I learned from Command Line Power User"
description: "I recently powered through Wes Bos' Command Line Power User series. Here's what I learned."
category: TIL
tags: [til,tools,technology]
---

My tech education has been almost exclusively Wes Bos based at the moment - I've finished React for Beginners, am halfway through his ES6 course, have Redux queued up, and am keeping an eye on his progress with his advanced React course. I'm also a listener of the podcast he produces along with Scott Tolinski, [Syntax](https://syntax.fm). 

As a short break from ES6, I powered through a slightly older course, [Command Line Power User](https://commandlinepoweruser.com/). Because of how long I've been working in a shell, most of the lessons Wes had to share I had already learned the hard way - but I did pick up a couple of tips that I'm posting about today.

### 1. `ls -m`

This flag can be used to change the format of the directory listing from a column-based view to instead of be a comma-separated list of files and directories. I can see this being useful for passing into scripts in the future, or at least providing a list of directory contents without all the surrounding formatting and whitespace. 

This flag was shown as a demonstration of ZSH's argument tab-completion, and it looks like there's a bunch of other arguments I'll have to check out in more depth.

### 2. `trash`

I think everyone's had a little `rm` whoopsie before. I know I have. One other tip that came up was having a command to send files and directories to a trash folder, rather than directly removing them. Seems obvious now, but I'd never thought of doing that. Wes even suggests aliasing `rm` to a `trash` command, which is a great idea.

It looks as though there is an [NPM package for a `trash` command](https://www.npmjs.com/package/trash). I'm going to do a bit more investigation here, as, since I work exclusively on my Macbook, I might be able to find something more lightweight than a Node.js library. 

### 3. The `z` command

The `z` command is a ZSH script that can be dropped in to provide "frecent" jumping to directories (frecent being "frequent" and/or "recent" directories). This looked interesting, and I might try it out sometime, but I've been using [`autojump`](https://github.com/wting/autojump) for some time, and it seems to have a similar feature set - so I don't really have a reason to switch, other than `z` being written purely in ZSH scripting language (looks like autojump is Python). 

### 4. The `take` command 

I've got to try and build this one into my muscle memory, because I would use it all the time.

`take` is a command built into `zsh.`. It's literally:

``` sh
take () {
	mkdir -p $1
	cd $1
}
```

...in other words, make a directory (or directory tree), and immediately change into it. Fantastic!

### 5. The `extract` plugin

`extract` is a plugin available as part of `oh-my-zsh`. It simply acts as an abstraction over the many, many archiving formats available, delegating to the appropriate utility (tar, ar, zip, etc). I've run into frustration before trying to get the right set of utilities and arguments to extract an archive, so I've also added this to my oh-my-zsh plugins!

---

Those were my takeaways, but the whole course was really interesting. I was pleased to see how well my current setup aligns with the productive setup demonstrated in the course - I'm also a ZSH user, though I only use a fraction of it's features. I jumped on the [oh-my-zsh](http://github.com/robbyrussell/oh-my-zsh) bandwagon when it was released - mostly for the pretty themes of course, and eventually even ended up creating [my own small set of plugins and a theme](https://github.com/joshmcarthur/dotfiles/tree/master/zsh). The only difference from the course content was that I have begun using antigen to control how much of oh-my-zsh is loaded when my `~/.zshrc` is sourced into my shell, as I found the default oh-my-zsh install method was getting a little slow to initialize.
