---
layout: post
title: "TIL: text underline position"
description: "The text underline position can move the underline position to improve the appearance of text."
category: til
tags: [til,technology,css]
---

TIL about the CSS property [`text-underline-position`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-position). This property is a useful progressive enhancement to achieve a particular look and feel for links, in particular for content with many descenders.

Examples:

<p style="text-decoration:underline;">This is standard underlined text.</p>
<p style="text-underline-position:under;">This text has the underline position set to "under".</p>
<p style="text-underline-position:above;">This text has the underline position set to "above".</p>

Browser support is not so good for this feature, it being fully supported only in Chrome and Edge on desktop, and Edge on mobile, so it is important to consider this a progressive enhancement. A similar effect can be achived with a CSS [bottom border](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom), however this can make alignment of "underlined" and non-underlined text difficult.
