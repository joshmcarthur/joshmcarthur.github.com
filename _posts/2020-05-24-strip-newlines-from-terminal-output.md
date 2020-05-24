---
layout: post
title: "Strip newlines from terminal output"
description: "How to remove newline characters from a shell stream"
category: TIL
tags: [til,technology,shell]
---

Every so often I will need to take some kind of key file - like a PGP key, SSH, OpenSSL, that kind
of thing, and be able to paste it into a one-line text entry somewhere. Maybe a .env file, or shell
script, or some piece of infrastructure that just accepts a text field as the input (like CI
configuration).

I've always had to google for how to remove newlines from such a file, and I've seen a range of
tricks using `sed`, `awk`, all of that sort of thing. 

I've just been able to find an easier way, which I'm documenting here, because I want to remember it
for next time. 

To remove newlines from a key-type file:

```
cat ~/.ssh/id_rsa.pub | tr -d '\n'
```

* `cat` - stream the file into the pipe
* `tr` - " tr - translate or delete characters"
* `-d` - delete the character, don't try and replace it
* `'\n'` - the character to delete (must be in single quotes to avoid your shell trying to interpret
  it).

Since I have `pbcopy` available on my laptop, I can easily copy this to my clipboard:

```
cat ~/.ssh/id_rsa.pub | tr -d '\n' | pbcopy
```

(I'm on Linux, but have an [alias for
pbcopy](https://github.com/joshmcarthur/dotfiles/blob/88af7b25550380916d8f7186f1f18160c98ef69d/zsh/plugins/macbuntu/init.zsh#L1)
so it behaves the same way as it would on Mac OS).

Or base 64 encode it first:

```
cat ~/.ssh/id_rsa | base64 | tr -d '\n' | pbcopy
```

