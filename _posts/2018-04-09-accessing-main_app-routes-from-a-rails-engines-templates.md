---
layout: post
title: "Accessing main_app routes from a Rails engine's templates"
description: "If routes aren't resolving in a template rendered by a Rails engine, try using `main_app`."
category: til
tags: [til,technology,rails]
---

If you are working with a template that has been rendered by a Rails engine (the example I most commonly have is [refinery](https://github.com/refinery/refinerycms), but any mounted Rails engine behaves the same way), then you will frequently run into a strange problem where route helpers (such as `widgets_path`, `new_whatever_path`, etc), result in an undefined method error, which can be quite frustrating to track down if you've not run into it before.

This errors occurs because the view context that the template is being rendered in is the engine's context, not the main application - long story short, the template is only looking at the engine's routes for route helper methods, not the app's routes. 

The trick to get this to work is to prefix your route helpers with `main_app`. With the examples I gave just above, this means that the route helper method names would be `main_app.widgets_path` and `main_app.new_whatever_path`. This prompts Rails to look in the correct application namespace for the route helpers, which it can then resolve. 
