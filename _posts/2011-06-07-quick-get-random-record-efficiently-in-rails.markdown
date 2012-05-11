---
title: "Quick: Get random record efficiently in Rails"
layout: post

type: regular
comments: true
---

You could use SQL's random function (RAND() or RANDOM() depending on database
engine) - but this isn't database agnostic, so isn't really very quick.
Instead you can use @nzkoz's suggested method:
Widget.first(:offset => Widget.count)
.... the count() method is fast, and the first() method will limit it to the
first result in the SQL as well.

