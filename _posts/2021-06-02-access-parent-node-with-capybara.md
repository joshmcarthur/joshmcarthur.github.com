---
layout: post
title: "Access parent node with Capybara"
description: "How to use Xpath with a CSS selector to access a parent node with Capybara."
category: TIL
tags: [til,rails,capybara,testing]
---

Sometimes I'll need to find an element in relation to another. An example of this is a link with a single icon element inside it:

``` html
<a href="/example"><img src="icon.png" alt="Example Page" /></a>
```

Because Capybara element finders can be chained (e.g. you can do `find().find().find()` to traverse down elements, the ability of XPath to traverse the DOM tree can be used to easily find the parent node:

``` ruby
page.find("img[alt='Example Page']").find("..")
# => Returns the 'a' element
```

Any XPath can be passed here, for example if you wanted to find a sibling of the parent or traverse further up the DOM tree. Handy!

&mdash; [via Stackoverflow](https://stackoverflow.com/a/6611237)


