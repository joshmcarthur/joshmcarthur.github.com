---
layout: post
title: "TIL about console.table"
description: "`console.table` is great for showing tabular data in the Chrome dev console."
category: TIL
tags: [til,techology,tooling]
---

I'm working through Wes Bos' [ES6 for Everyone](https://es6.io/), and he's dropped yet another useful tip for me to build into my day-to-day work - `console.table`.

`console.table` supports both objects and arrays, displaying data in a table format that is much
easier to read than simply logging the data:

`console.table(user)`
![Output of `console.table` with an object data structure](/img/posts/console-table-object.png)

`console.table(repos)`
![Output of `console.table` with an array data structure](/img/posts/console-table-array.png)

To restrict which columns are shown for a collection of objects, a second argument can be passed to restrict which property names are shown:

`console.table(repos, ["name", "description"])`
![Output of `console.table` with an array data structure and restricted columns](/img/posts/console-table-array-columns.png)

`console.table` [appears to be supported](https://developer.mozilla.org/en-US/docs/Web/API/Console/table) in all modern browsers, so it's ready to go for any development workflow!
