---
title: Arbitrary Ordering in PostgreSQL when Rails + ENUM = No.
layout: post

type: regular
comments: true
---

I've recently had to do a custom sort for a work project that has required a
sort on something that is not naturally sortable correctly (For example,
alphabetical or numerical sorting). While searching for a completely different
solution, I came across [this post](http://stackoverflow.com/questions/1309624/
simulating-mysqls-order-by-field-in-postgresql) that outlined a nice technique.
Basically, when you have a field in your Rails model with a predefined set of
possible values, you can use a CASE statement in PostgreSQL to perform the sort
in whichever order these values should appear. Here's a sample of how this
could be achieved using Rails:
{% highlight sql %}
Result.order("CASE " + "WHEN medal='gold'
THEN 1 " + "WHEN medal='silver' THEN 2 " + "WHEN medal='bronze' THEN 3 " +
"ELSE 4 " + + "END,name")
{% endhighlight %}

It's messy of course - how you want to format the
SQL string is up to you, but it's a great solution when you don't have the
normal sorting capabilities of a ENUM datatype available to you.

