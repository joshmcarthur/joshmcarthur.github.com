---
title: Running Rake tasks with Cron (RVM)
layout: post

type: regular
comments: true
---

Recently I've had to deal with a strange problem with rake tasks being run
using Cron, a UNIX tool for running commands on a scheduled basis. The problem
was basically the server being slowly strangled of resources across a forty to
fifty minute time period, as each time the rake task was run it would leave an
entire bash process sitting there consuming resources.
I had assumed that this problem was relating to the rake task exiting in a non-
normal fashion - an exception maybe, or just not returning something that bash
was requiring to say 'OK, I can close now'. As it turned out, the solution was
even more basic than that.
The server is question is a bit of a prototype, as it's using a system-wide
installation of RVM to mange two very different sets of gems. To help
integration with Passenger, each project directory has an .rvmrc file that
automatically sets the correct Ruby version and Gemset when that directory is
entered. RVM has a neat security feature however, that prompts you to view and
approve the file before it is executed for the first time - and, you guessed
it, this is what was tripping up Cron.
What was happening, is that Cron was changing directory to the release path in
order to execute the rake task - but not getting as far as actually executing
the Rake task. Instead, Cron was being presented with a security warning from
RVM, which was very cleverly sitting there waiting for input to approve the
file - causing Bash to sit there... for ever.
Fortunately, I did find a solution - it is possible to turn this security
mechanism file off, to stop it from prompting for approval of the .rvmrc file,
by adding a configuration flag to the default rvmrc file in /etc/rvmrc - here's
the configuration flag:
export rvm_trust_rvmrcs_flag=1
(It goes inside what should be an if block).
From now on, when Cron runs the rake tasks, it won't be presented with this
prompt - approval will be assumed. No more server resources limits exceeded
alerts!

