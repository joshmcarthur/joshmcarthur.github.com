---
title: "Restart rails quickly with bin/rails restart"
---

Just a quick tip! If you're like me, you start with just one or two tabs (or
tmux panes), and things get more and more disorganised as the day goes on. If
you need to restart your Rails server quickly, and don't feel like hunting out
your Rail server terminal, no worries! Just running `bin/rails restart` will
signal the server process, wherever it's running, to restart itself. This can
also be used on a deployment server, to restart the server process without
actually knowing what the process is (though you should really be using proper
process/service manager on a server!).

Technically, this also means that if you really don't want your server visible
in your terminal, you _could_ also run the server daemonised (e.g. in the
background), and just restart it when you need.