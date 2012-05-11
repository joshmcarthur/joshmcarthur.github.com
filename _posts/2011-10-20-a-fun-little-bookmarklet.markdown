---
layout: post
title: "A Fun Little Bookmarklet"
date: 2011-10-20 13:28
comments: true
categories: fun,nerdy
tags:
  - fun
  - javascript
  - experiments
---

I'm sure this has been done before, but after noticing [1-day's](http://www.1-day.co.nz)  'Look Busy' feature, I just had to write a bookmarklet to load this up on any site!

If you just want to try it out, here's the link <a href="javascript:var busy=document.createElement('div');var body=document.getElementsByTagName('body')[0];var max_width_cache=body.getAttribute('max-width');body.style.maxWidth='100%';busy.setAttribute('id','lookbusy');busy.setAttribute('style','position: absolute; z-index: 1000; width: 100%; height: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; background: #FFF url(http://www.1-day.co.nz/images/2010_mission_critical_development_strategy.png) no-repeat 0 0;');var close=document.createElement('a');close.setAttribute('class','busy close');close.setAttribute('style','position: fixed; z-index: 1001; right: 10px; bottom: 10px; background-color: #FFF; color: #000; font-size:10px');close.setAttribute('href','#');close.innerText='OK, Clear';close.setAttribute('onclick',&quot;javascript:body.removeChild(document.getElementById('lookbusy'));body.style.maxWidth = &quot; + max_width_cache);busy.appendChild(close);body.appendChild(busy)">Look Busy Bookmarklet</a> - either right-click on the link and 'Copy URL' and paste into a new bookmark, or drag to your bookmarks bar or folder. It should work in Chrome, Safari, Firefox and IE7-9

Here's the source code for anyone interested in seeing how this works:

``` javascript
// Create a new div tag to contain our image
var busy = document.createElement('div');
var body = document.getElementsByTagName('body')[0];
var max_width_cache = body.style.maxWidth;
body.style.maxWidth = '100%';
busy.setAttribute('id', 'lookbusy');

// Add a background image, and position the div tag above all other content and make it fill the screen
busy.setAttribute('style', 'position: absolute; z-index: 1000; width: 100%; height: 100%; top: 0px; left: 0px; right: 0px; bottom: 0px; background: #FFF url(http://www.1-day.co.nz/images/2010_mission_critical_development_strategy.png) no-repeat 0 0;');

// Add a inconspicuous link to close the image
var close = document.createElement('a');
close.setAttribute('class', 'busy close');
close.setAttribute('style', 'position: fixed; z-index: 1001; right: 10px; bottom: 10px; background-color: #FFF; color: #000; font-size:10px');
close.setAttribute('href', '#');
close.innerText = "OK, Clear";
close.setAttribute('onclick', "javascript:body.removeChild(document.getElementById('lookbusy'));body.style.maxWidth = " + max_width_cache);

// Add the close image to the look busy div tag
busy.appendChild(close);

// Add the look busy div tag to the body of the document
body.appendChild(busy);
```

Give it a go! It's super handy for when you're checking out [TradeMe](http://www.trademe.co.nz), [Failblog](http://failblog.org), or [anything similar](http://images.google.com?q=wink)!

