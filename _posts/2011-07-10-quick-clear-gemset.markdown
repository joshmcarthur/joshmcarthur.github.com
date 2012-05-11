---
title: "Quick: Clear Gemset"
layout: post

type: regular
comments: true
---

If you're finding that you have to change something fairly significant in your
bundler dependencies, it's usually a good idea to get rid of what you've got
loaded in an RVM gemset so that you don't end up with different versions of
gems fighting with each other. To do this, simply run **`rvm gemset empty`** -
it'll delete all the gems currently in your gemset, giving you a blank slate.

