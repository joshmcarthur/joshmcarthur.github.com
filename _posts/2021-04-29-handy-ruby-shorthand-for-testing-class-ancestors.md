---
layout: post
title: "Handy Ruby shorthand for testing class ancestors"
description: "Using the <= shorthand operator to test a class's ancestors"
category:  TIL
tags: [til,ruby]
---

Today I was working on a method that had to take a string, and resolve it to a class. This method needed to perform some validation on the model class, to make sure it was a type we expected.

My first iteration of this didn't work - I expected that I could use [`Object#kind_of?`](https://docs.ruby-lang.org/en/2.7.0/Object.html#method-i-kind_of-3F), however this only works for testing whether an _instance_ is a kind of class or module, rather than the class itself. This check looked like:

``` ruby
model.kind_of?(ParentThing)
```

My next iteration did a direct superclass comparison:

``` ruby
model.superclass == ParentThing
```

This worked, but was more brittle than I wanted, since it would only work when `ParentThing` was the _direct_ ancestor of the class.

I checked in on my company Slack, where [Eoin](https://eoinkelly.info/) reminded me of the [`ancestors`](https://docs.ruby-lang.org/en/2.7.0/Module.html#method-i-ancestors) method, which returned an array of the ancestors of the class or module the method was called on - essentially, the superclass chain. From this, I composed the test:

``` ruby
model.ancestors.include?(ParentThing)
```

This worked, was flexible enough to allow `ParentThing` to not be the direct ancestor, so I went to commit it, when Rubocop conveniently told me of a recommended replacement:

> _Performance/AncestorsInclude: Use <= instead of ancestors.include?_

This led me to the [Rubocop documentation](https://docs.rubocop.org/rubocop-performance/cops_performance.html), then to the [Fast Ruby reference](https://github.com/JuanitoFatas/fast-ruby#ancestorsinclude-vs--code), indicating that not only does that shorthand exist, it is also faster. Neat!

The `<=` method, along with a few other handy-looking examples, are documented in the [Ruby documentation](https://docs.ruby-lang.org/en/2.7.0/Module.html#method-i-3C-3D).

> **mod <= other → true, false, or nil**
>
> Returns true if mod is a subclass of other or is the same as other. Returns nil if there's no relationship between the two. (Think of the relationship in terms of the class definition: “class A < B” implies “A < B”.)

My final check implementation became a lot simpler:

``` ruby
model <= ParentThing
```


