---
layout: post
title: "TIL how to fork a Heroku application"
description: "The heroku-fork plugin provides a convenient way to 'fork' a Heroku app"
category:  TIL
tags: [til,technology,deployment]
---

Tonight I had a need to create a duplicate of a running app on Heroku, and discovered [heroku-fork](https://github.com/heroku/heroku-fork). This is a plugin which was extracted from the core Heroku CLI some time ago, but is easily installable using the command `heroku plugins:install heroku-fork`. It is run via:

`heroku fork --from [app name] --to [app name, can be new app]`

The command adds functionality which can copy one app to another, including  
code, addons, dyno configuration, and databases. In my case, I used it to quickly test some changes to a service worker against a clone of a production application before pushing these changes live. It no more than a couple of minutes to copy the application, and then I simply destroyed it when I was done. 

A super handy trick that I'll have to keep in mind for future support work.
