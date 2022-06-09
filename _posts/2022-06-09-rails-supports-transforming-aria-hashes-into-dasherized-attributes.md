---
layout: post
title: "Rails supports transforming aria hashes into dasherized attributes"
description: "Rails can transform aria hashes into dasherized attributes, just like data hashes!"
category: TIL
tags: [til, rails]
---

TIL that aria- attributes get the same treatment in Rails tag helpers as
`data-`. That is, you can do:

- `link_to "X", y_path, aria: { pressed: true }` -> `aria-pressed="true"` OR
- `link_to "X", y_path, "aria-pressed" => true` -> `aria-pressed="true"`

I can’t find any multi-dash aria properties on MDN, but I imagine Rails will
follow the same formatting rules of turning underscores to dashes, e.g.

- `link_to "X", y_path, aria: { active_status: "madeup" }` ->
  `aria-active-status="madeup"`

This is a handy thing to know, since this lets long tag definitions be nicely
wrapped and indented across multiple lines, as well as naturally grouping
related attributes.