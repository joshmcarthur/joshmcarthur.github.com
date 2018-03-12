---
layout: post
title: "TIL: The |= pipe equals CSS selector"
description: "The |= operator is great for loosely finding BEM elements and other dasherized classes."
category: til
tags: [til,technology]
---

Today I learned about a CSS selector I have not used a great deal before - pipe-equals. The [spec](https://www.w3.org/TR/selectors/#attribute-representation) describes this operator as:

> Represents an element with the att attribute, its value either being exactly "val" or beginning with "val" immediately followed by "-" 

This selector is particularly useful for loose matching of [BEM](http://getbem.com/) CSS classes, and other dasherized class naming systems, for example:

``` css 
[class|="icon"] {
  background: #656565;
}

.icon--small {
  width: 32px;
  height: 32px;
}

.icon--medium {
  width: 64px;
  height: 64px;
}

.icon--large {
  width: 128px;
  height: 128px;
}
```

For information:
* [W3C CSS Selectors Level 4 Specification](https://www.w3.org/TR/selectors/#attribute-representation)
* [Mozilla Developer Network: Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors)

