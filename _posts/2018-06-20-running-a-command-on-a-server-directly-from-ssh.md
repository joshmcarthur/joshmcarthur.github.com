---
layout: post
title: "Running a command on a server directly from SSH"
description: "If you've got a quick task to accomplish, running a command straight from SSH is a good way to go"
category: TIL
tags: [til,technology,ops]
---

The SSH command accepts a very useful argument that I think is underused by many devops folks looking to run a quick command and get on with their day.

The output of the synopsis of the SSH command man page (`man ssh`) ends with:

```
[user@]hostname [command]
```

This `[command]` is the useful bit - you can pop any command you like here, and SSH will connect and authenticate to the server, run the command (directing IO to your client as normal), and then exit. This makes it great for standalone tasks that can just...run, for example:

- `ssh user@host df -h` - to show the disk usage on a server
- `ssh user@host ls -lah` - to list the contents of the authenticating user's home directory
- `ssh user@host "cd /u/app && bundle exec rake db:migrate"` - to change into a Rails app working directory and run migrations

Taking little shortcuts with common commands like this can seem kind of simple, but I've found that the time I save really adds up. You can also make use of the command argument for scripting - for example, to automate updates or provisioning.
