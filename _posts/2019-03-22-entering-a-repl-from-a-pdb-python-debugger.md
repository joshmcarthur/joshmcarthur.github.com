---
layout: post
title: "Entering a REPL from a PDB Python debugger"
description: "Getting into a repl session from a PDB breakpoint is the easiest way to dig into a bug."
category: TIL
tags: [til,technology,python]
---

Something I have grown accustomed to when debugging Ruby code is the ability to jump into an `irb`
session right from a breakpoint. With `byebug` this pretty much happens immediately. With `pry`,
running `irb` will have the desired effect.

When I started getting to the point where I needed to debug Python code I was writing, I almost
immediately had to find out how to do the same thing with `pdb` - I wasn't getting anywhere with
`print()` and the `p`, `pp` commands built into `pdb`.

It turns out that the Python debugging module (`pdb`) does have a built in command to drop to a repl
with the context of the breakpoint - it's just a slightly differerent terminology to Ruby.

To drop to a REPL from a PDB breakpoint, the **`interact`** command is what you're after. 


``` python
def hello_world():
  name = "you"
  pdb.set_trace()
  print(f'Hey {name}')
```

![Screen recording demo](http://g.recordit.co/UswyzFbQSX.gif)


