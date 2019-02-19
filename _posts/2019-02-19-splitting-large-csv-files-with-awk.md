---
layout: post
title: "Splitting large CSV files with awk"
description: "How to split large text files by a delimeter using awk"
category: TIL
tags: [til,technology,shell]
---

I recently [learned](https://unix.stackexchange.com/a/297684) of a useful technique when processing
large text files that have a consistent separator using awk.

[`awk`](https://en.wikipedia.org/wiki/AWK) is a text processing programming language dating all the
way back from 1977. While the format string passed to `awk` technically represents a full
programming language, it is most typically used directly from the command line or from shell
scripts.

The command to split a file is easily represented as:

``` sh
awk -F\, '{print>$1}' input.csv
```

This command contains a field separator specification (in this example it is comma, escaped just in
case - but it can be any character), and a very small Awk directive: `{print>$1}`. This directive
takes the current line, and writes it to a file named after the first field. Unlike normal shell
programming, `>` in `awk` will _append_ to a file if it already exists, unlike the sh `>` operator,
which typically overwrites the file. `$1` simply represents the first column based on the field
separator. If you need to reference any other column, you can simply use an incremented placeholder -  `$2`, `$3` and so on.

