---
layout: post
title: "Prevent unnecessary slowdown in IRB sessions with slow method calls"
description: "IRB automatically inspects the results of methods. This can cause unnecessary slowdown"
category: TIL
tags: [til,technology,rails]
---

One of the convenient things that any interactive Ruby sesion (IRB) does for you is to `inspect`
the return value of the statement it has just evaluated. 

This is normally great, but if you have something that takes a LONG time to evaluate and you don't
actually care about the result, it can cause the session to block completely unnecessarily.

The best example of this is loading an `ActiveRecord::Relation`. If you've worked with ActiveRecord
before, you'll know that queries are lazily-executed - the actual SQL statement is not prepared and
executed until a method is called that requires the results. 

The gotcha here is that `inspect`-ing an `ActiveRecord::Relation` by default tries to echo out the
models or other values you have requested - even if you yourself haven't actually requested them.
This can cause some pretty big delays in IRB or a Rails console if you have a large dataset your
relation is querying.

To prevent this, if you need to grab a relation object (or anything else that takes a short amount
of time to build, but a long amount of time to actually load), just assign the relation to a
variable, and add on `; true` to the end of your statement. When IRB evaluates this line, it will
assign the relation object to the variable, but will not need to `inspect` it, because it's not the
final result of the statement - `true` is - and calling `inspect` on a boolean just stringifies it,
which takes no time at all.

Here's an example. Let's say we have billions of `Widget` rows in our database. Fetching all of them
takes a terrible worst case scenario of 2 minutes.

Why run this:

```
> Widget.where.not(id: nil)
=> [<Widget #1>, <Widget #2>...]
```

in 2 minutes, when you can run:

```
> relation = Widget.where.not(id: nil); true
```

in no time at all!


