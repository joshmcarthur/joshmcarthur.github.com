---
title: I18n ALWAYS escapes dots in chained backends :-(
layout: post

type: regular
comments: true
---

Just a quick tip I've come across while browsing through the comments on a
Railscast_I've_been_watching. It looks like the I18n gems that get
automatically installed with Rails 3 have a teensy bug.
When storing a translation to the backend (be it YAML, Redis, whatever), there
is an :escape option that can be passed to enable (or prevent) the key from
containing the dot character (.) (Among others, I'm sure). This seems to work
fine when dealing with a single backend, but unfortunately when you are using
chained backends (For example I am using Redis preferentially, but falling back
on YAML when necessary), the options hash that you would pass the :escape
option in is mistakenly initialized to an empty hash.
It's a simple fix - there is already a closed pull request on the issue here.
It looks like the latest stable version is only 0.50 though, so the fix isn't
going to filter through to the actual gem just yet. For now, the best option is
probably to class_eval into that particular section, or just change the file
yourself.

