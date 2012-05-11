---
layout: post
title: "Add jQuery to Any Page Really, Really Easily"
date: 2011-11-12 21:27
comments: true
categories: howto, nerdy
tags:
  - javascript
  - useful
  - jquery
---

When I'm working on a site, or analysing somebody else's, I often wish that jQuery was loaded into that page - it's an unbeatable tool for really digging into the site's source to debug something or work out how something has been done.

To help out with this, I've put together a quick bookmarket, [similar to the more fun one I've done a while ago](http://blog.joshmcarthur.com/2011/10/20/a-fun-little-bookmarklet/). It works extremely simply - it just creates a script element, adds jQuery 1.7.0 (served from Google), and appends it to the page body. As soon as the script has loaded, jQuery can be used from within Web Inspector, Firebug, or whatever other Javascript console you use.

Here's the bookmarklet:

<a href="javascript:var s=document.createElement('script');s.type='text/javascript';s.src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js';document.getElementsByTagName('body')[0].appendChild(s);">Add jQuery</a>

To add this to your browser, you can either: right-click on this link, select 'Bookmark Link', or just drag-and-drop onto your Bookmarks toolbar. Once it's added, you can simply click on the bookmark on any page, and jQuery will be loaded into the page for you to use.

Here's the source:

``` javascript
// Create the script tag
var s = document.createElement('script');

// Set the necessary attributes on the tag
s.type = "text/javascript";
s.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js";

// Add to the body tag (assume here we're dealing with HTML, and there IS a body tag)
document.getElementsByTagName('body')[0].appendChild(s);
```
