---
title: "Capistrano rvm-shell: command not found error"
layout: post

type: regular
comments: true
---

I've just come across this problem, and I had to share it here - I can't find
anywhere else on the the Internet where the solution is specifically stated -
it's just alluded towards. If you are using RVM's Capistrano integration, you
may come across a CommandNotFoundError to do with rvm-shell not being under /
usr/local/rvm/bin (Which is exactly where it should be). Upon searching the
internet, you will find that you have to upgrade RVM (you don't), and that when
installed for a local user, RVM puts rvm-shell under ~/bin (But, you know, it's
a system-wide install). The solution is really simple - rvm-shell is under /
usr/local/bin - use `set :rvm_bin_path, "/usr/local/bin"` in your deploy
script, and you're away. Clearly this is a bug with RVM putting things where it
shouldn't, but that's the way of things. And, if I sound a little short, it's
because I had to all but reinstall RVM and break everything before realizing
this.

