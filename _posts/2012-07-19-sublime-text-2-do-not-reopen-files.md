---
layout: post
title: "Sublime Text 2: Do not reopen files"
description: ""
category: 
tags: []
---

For quite some time now, I've been using [alloy's fork of Macvim](https://github.com/alloy/macvim) as my primary editor, along with [janus](https://github.com/carlhuda/janus), and it's been working out really well.

I've just started trying out Sublime Text 2 though, and it's been pretty nice (although I still have reservations). Something I **can't stand** in a developer application though, is for an application to re-open all the files you had open last time the application was used. Sure enough, this is something that Sublime Text 2 does.

To turn it off, you can change the following settings in your user preferences file. To open these preferences, open Sublime, click the application menu, and then go to 'Preferences' -> 'Settings - User', and add the following keys:

``` JSON
	"hot_exit": false,
	"remember_open_files": false
```

> If you haven't already added any user settings, these two lines will need to be surrounded by curly braces - "{" and "}".

I don't understand why any application needs to re-open files - if I close an application, that means I don't need it anymore. If I needed it again, I would just leave it open, or suspend my computer and come back to it later. 

Hopefully these settings make things a bit easier on somebody else though - I couldn't find this documented anywhere on the internet from a quick Google, so had to jot it down here.
