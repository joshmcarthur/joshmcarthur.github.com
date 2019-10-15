---
layout: post
title: "See full Rails application logs on Heroku"
description: "Heroku suppresses exception logs from your application. Here's how to reenable it."
category: TIL
tags: [til,technology]
---

I recently had an issue on an application that was deployed to Heroku. I could see from the frontend
that I was getting a 500 status code in response to my request, but when I took a look at the Heroku
logs (using `heroku logs`), I saw a single line containing my request, but no other details:

```
2019-10-15T02:47:56.555551+00:00 heroku[router]: at=info method=POST path="/widgets"
host=www.widgets.example.com request_id=c4819835-c2e6-480b-8bd3-4d70725f8bbf fwd="43.255.160.224"
dyno=web.1 connect=0ms service=45ms status=500 bytes=1891 protocol=https
```

This is interesting, because Heroku definitely used to log whatever your Rails app spat out to
STDOUT, but it seems that by default they now suppress some messages - even if your application is
configured with a verbose log level, like my application was set to: `config.log_level = :debug`. 

The solution to this problem came from [this StackOverflow
answer](https://stackoverflow.com/a/22852185) - Heroku has a separate `LOG_LEVEL` environment
variable that can be set to control the verbosity of your process logs. A simple `heroku config:set
LOG_LEVEL=debug`, and I was seeing the stacktrace in my log output. Nice! Once you've got the error
tracked down and resolved, you can either remove this config value entirely, or reduce it to a less
verbose level, like `warn`. 
