---
layout: post
title: "Accessing selected element in Chrome DevTools"
description: "The selected (or last selected element) can easily be accessed in the Console of Chrome DevTools"
category: TIL
tags: [til,technology,tools]
---

Chrome's DevTools are something that I use for a decent portion of my day whenever I'm doing frontend work. I really appreciate how much work has gone into making for a great developer experience, and I'm always stumbing across new tricks to help make me more efficient.

Just one of these tricks I picked up this morning from Wes Bos' &ldquo;React for Beginners&rdquot; course in passing, and it's been a bit of a revelation for me.

When an element is selected in the Elements tab of the devtools, you may have noticed it displays something like this:

```
<div class="innerWrapper clearfix">…</div> == $0
```

I've always seen the `== $0` and kind of skipped over it, assuming it's some kind of notation that I'm just not familiar with.

It turns out though, that this is Chrome communicating that the currently selected DOM element has been assigned to a variable named `$0`. This variable can be used straight from the Console for looking up more detailed information, or even manipulating the DOM node in some way. 

![Gif of using the selected element in DevTools](/img/posts/devtools-select-element.gif)

Just a really nice trick that is going to make my life that much easier next time I need to drill down into an element. 