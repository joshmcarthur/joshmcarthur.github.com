---
title: Accessing controller instance variables in model (Urgh?)
layout: post

type: regular
comments: true
---

I can tell that this title alone will irritate a lot of developers out there.
It irritated me as well, until I figured out that sometimes, doing things the
'wrong' way is the best/only way. But let me get on with things.
Every now and then, you will come across a scenario where you need to access
something in the controller, from the model. This is so obviously non-MVC that
many will (should) immediately shy away from it, but let me suggest a scenario.
Let's say you have users, who should be scoped to a particular subdomain. You
would place a default_scope on the User model (with a Proc, once an issue with
default_scope is resolved), that would automatically add conditions to any
database lookup calls to restrict the found users to those belonging to the
current subdomain. The tricky bit is, of course to get this subdomain. Because
it is a default scope, you don't actually 'call' it - so that rules out passing
parameters. I've come across other suggestions as well, such as using
cattr_accessor (NO! It's shared across requests), and storing a value in
Thread.current (Relying on the application using threads in the way you expect
them to = not safe). So far though, the best hint I have seen here, although
extremely anti-doing what I am suggesting, would seem to work.Â 
Basically, the jist of this post was that you could dynamically add methods to
ActiveRecord::Base using an around_filter to access sessions, cookies, params
and the request. Now, I agree that this might be a bit too extreme - if you
really need to access the entire session or cookie hash, for example, you
probably aredoing something wrong. Something that I think isÂ suitable though,
given an appropriate situation, is to use this technique to add an 'accessor'
to ActiveRecord::Base that returns the value you need in your model - the
current subdomain for instance. This is still non-MVC, but is, I think, a far
more elegant solution that anything else I've seen suggested.

