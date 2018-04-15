---
layout: post
title: "HTML5 hidden attribute on option tags"
description: "The `hidden` attribute can be used to hide an attribute in a <select> element"
category: TIL
tags: [til, technology, html5]
---

This morning I learned about the `hidden` attribute that can be added 
to `<option>` tags within a `<select>` tag. The hidden attribute causes the option to simply not be shown in the list. Hidden elements will are also not selectable and will not return any selected value. 

The `hidden` attribute works in [most browsers](https://caniuse.com/#feat=hidden), with ~97.5% of browsers supported. For IE10 and below (depending on the browser breakdown of your application), an acceptable fallback would be to also add the `disabled` attribute to the option. The browser in this case would still show the option, but it would be greyed out and not selectable.

As an example, this HTML:

``` html
<select>
  <option>First option</option>
  <option>Second option</option>
  <option hidden disabled>Third option</option>
</select>
```

Yields the following result:

<select>
  <option>First option</option>
  <option>Second option</option>
  <option hidden disabled>Third option</option>
</select>

And in IE10:

<img src="/img/posts/select-hidden-attribute.png" width="473" alt="Demo of select `hidden` attribute in IE10" />


