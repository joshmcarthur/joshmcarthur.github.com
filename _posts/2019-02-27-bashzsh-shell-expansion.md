---
layout: post
title: "Bash/Zsh shell expansion"
description: "Handy everyday shell expansion shortcuts"
category: TIL
tags: [til,technology,shell]
---

Shell expansion is an incredibly handy shortcut. Previously to today, I've only ever used glob
(`*`), which will expand to include all directories and files within the glob scope (e.g. `*` would
list all files and directories in the current directory, `test/*` would list all files and
directories in `test/`).

There are more though! Today I'm covering `{ range }` and `{ list }`, which are convient ways to
expand a known range or list of values. In most cases, it can be used to avoid a for loop, the exact
syntax for which I _always_ have to look up.

#### Range expansion

**Syntax:** `{start value...end value}`

**Example:** `{0..5}`, `{5..10}`.

This expression expands numbers, and as far as I can tell, character ranges like `{a..z}`. This is great
if you have directories that are incrementally numbered, and you want to target a subset of them.
This isn't a magical directive that gets passed to shell scripts - it gets expanded before that and
passed to the script, which means that this expansion will work with _any_ script that accepts
multiple arguments - things like `echo`, `cp`, `mv` and friends come to mind, but many scripts
accept a list of files to process somehow. 

Negative numbers do not appear to be supported, so the minimum start value is '0' - it can of course
be a larger number than this. It's worth pointing out that the range just passed each value to the
command - it won't skip values that don't map to a file or directory for example. 

Examples:

Make 10 new directories:

```
> mkdir {0..10}
> ls
0	1	10	2	3	4	5	6	7	8	9
```

Remove the first 5:

```
> rm {0..5}
> ls 
10	6	7	8	9
```

Add 5 more, but start from 50:

```
> mkdir {50..55}
> ls
10	50	51	52	53	54	55	6	7	8	9
```

#### List expansion

**Syntax:** `{first value, second value, ..., last value}`

**Examples:** `{cats,dogs,birds,cows}`, `{1,2,3,5,8,13}`

This expression expands to each value in the list. In other words, it's not necessarily as handy as
the range expression for passing directly to a command, BUT it can be used as part of a wider
filename.

As an example, let's say that we have a directory structure like:

```
   |-livestock
   |---cows
   |---deer
   |---sheep
   |-pets
   |---birds
   |---cats
   |---dogs
```

You can use list expansion as part of a file path, for example to list all the animals:

```
> ls {livestock,pets}

livestock:
cows	deer	sheep

pets:
birds	cats	dogs

```

To list all the animals whose name starts with 'c':

```
> ls {livestock,pets}/c*

livestock/cows:

pets/cats:
```


