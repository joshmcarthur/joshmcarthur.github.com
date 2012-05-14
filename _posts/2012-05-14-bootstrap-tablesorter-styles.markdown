---
layout: post
title: Bootstrap Tablesorter Styles
---

When [Twitter Bootstrap](http://twitter.github.com/bootstrap) first shipped, it came with a couple of handy integrations with external jQuery plugins. Once of the more popular of these integrations was styles that were compatible with the classes, elements and attributes added by [jQuery Tablesorter](http://tablesorter.com/docs/).

Recently, however, these integrations have been removed from Bootstrap, as it was felt that they were distracting from the core of what the project was trying to achieve, and that as most plugins were themeable anyway, users of Bootstrap could just build a theme.

This is all well and good, but sometimes it's just a quick fix that is necessary. Here's the CSS needed to provide Bootstrap look-and-feel in the table sorter plugin:

{% highlight css %}
table .header {
	cursor: pointer;
}
table .header:after {
  content: "";
  float: right;
  margin-top: 7px;
  border-width: 0 4px 4px;
  border-style: solid;
  border-color: #000000 transparent;
  visibility: hidden;
}
table .headerSortUp, table .headerSortDown {
  background-color: #f7f7f9;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
}
table .header:hover:after {
  visibility: visible;
}
table .headerSortDown:after, table .headerSortDown:hover:after {
  visibility: visible;
  filter: alpha(opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}
table .headerSortUp:after {
  border-bottom: none;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #000000;
  visibility: visible;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  filter: alpha(opacity=60);
  -moz-opacity: 0.6;
  opacity: 0.6;
}
{% endhighlight %}

Add this stylesheet into your project to add the tablesorter integrations from Bootstrap 1, to Bootstrap 2. It doesn't mess with the default table styles or anything else, but does make the tablesorter feel much more integrated.

(The original discussion on this issue is from: [this Google Group thread](https://groups.google.com/forum/?fromgroups#!topic/twitter-bootstrap/NP8gnUEeUrY))