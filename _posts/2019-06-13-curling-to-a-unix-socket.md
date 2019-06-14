---
layout: post
title: "CURLing to a UNIX socket"
description: "How to test a UNIX socket with cURL
category: TIL
tags: [til,technology,server-admin]
---

In deployed environments, I often come across two Ruby application servers - Unicorn, and Puma. 
These servers are usually configured to listen on a UNIX socket file, usually located in the `tmp/sockets` directory of a Capistrano install, e.g. `/home/deploy/appname/shared/tmp/sockets/appname.sock`.

It's quite often useful to be able to connect to a UNIX socket to see if the application server is behaving correctly, 
especially if the instance is not accessible via a public IP address. A little-known feature of the
`curl` command line is that it accepts a `--unix-socket` argument to send requests to. This allows
application servers and any other process that listens on a socket and supports HTTP to be tested
easily with a command like:

``` bash
curl --unix-socket=/home/deploy/appname/shared/tmp/sockets/appname.sock
http://localhost/my-application-route-goes-here`.
```

All the usual features of cURL are available when the UNIX file is provided, such as making
POST/HEAD/OPTIONS/anything else requests, sending form data or files, and using cookies. 

I've found that this technique is very handy for diagnosing problems that lie between the web/proxy
server (usually Nginx), and the application itself.
