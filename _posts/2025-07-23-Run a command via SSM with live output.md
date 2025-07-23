---
title: How to run a command via AWS SSM with live output
category: TIL
---

This little technique is a great example of how simple \*nix utilities can be
(mis)used to accomplish some interesting things:

```sh
 (echo "./deploy.sh" && cat && exit && exit) |  aws ssm start-session --target $INSTANCE_ID
```

This:

1. Echos the command into the shell session once started (`echo "./deploy.sh"` -
   obviously whatever command you want to run goes here)
2. Runs `cat` to capture any output from that command until the command exits
3. _n_ `exit` calls, where _n_ is the number of shell sessions you've got. I
   have two, because SSM by default runs `sh`, then I have a Linux profile set
   up in SSM that runs `bash`. This will drop you back where you started, in
   your shell.

This accomplishes the same result as using `send-command` with the built-in
`AWS-RunShellScript` document (which is what `start-session` uses under the
hood), but shows output of the command in real-time, just like `ssh ... -c`
would, without the need to wait for the SSM command to finish executing before
output is visible.
