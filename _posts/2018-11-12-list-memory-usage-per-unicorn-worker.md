---
layout: post
title: "List memory usage per Unicorn worker"
description: "Use shell commands to list the memory usage of each Unicorn worker"
category: TIL
tags: [til,ops,technology,rails]
---

I have been using this snippet recently to show the amount of memory currently being consumed by
each Unicorn worker. This is a convenient way of checking:

1. The expected number of workers is being run
2. The memory usage of workers is fairly uniform
3. The average memory usage of Unicorn workers (if you are considering adding or removing workers)

Here's the command:

``` bash
ps -e -www -o pid,rss,command | grep -e '[u]nicorn_rails worker' | awk '{printf "%s %s\t%s mb\n",$3,$4,$2/1024}'
```

To break this down:

* `ps -e -www -o pid,rss,command` - list each process's pid, memory usage in bytes, and the command 
* `grep -e '[u]nicorn_rails worker'` - filter the command list to those than mention Unicorn workers
* `awk` - this just pretty-prints the list in the format '[command] [memory] mb`.


