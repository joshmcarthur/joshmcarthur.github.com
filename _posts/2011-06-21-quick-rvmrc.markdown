---
title: "Quick: .rvmrc"
layout: post

type: regular
comments: true
---

This post is probably something more experienced RVM users will already know,
but I wanted to post this as it's definitely my discovery of the week. When
throwing an .rvmrc file into a project, it's a nice thing to do to write the
script correctly so that it will just work for other developers (As well as
telling you what gemset you're using when you jump into the directory). In your
.rvmrc file, put something like this: `rvm use 1.9.2@gemset --create` ...this
will attempt to use that gemset (Printing out a nice message telling you it's
using that one as it does so), and will create it if it doesn't exist.

