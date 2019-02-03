---
layout: post
title: "My understanding of CSS units"
description: "Jotting down my thoughts and approaches to units in CSS"
category: TIL 
tags: [til,css]
---

I was listening to [Episode #107 of the Syntax Podcast](https://syntax.fm/show/107/hasty-treat-css-units) this afternoon, which covered CSS units, and was inspired to actually stop and think about how I use units when writing CSS. I felt pretty reassured that generally my approach is in line with what Wes and Scott were discussing. Let's go!

### rem

I use <abbr title="Relative Em">rem</abbr> by default for most things. Usually this is margin, padding, and font sizing. rem sizing works well for me because I like to establish a baseline sizing at the document root. Usually this is 8px, but occasionally I'll work with a 4px or 16px baseline. Once I've set this global base size, I can use rem to work in multiples of the baseline, keeping everything relative. This makes it simple to adjust the sizing later, since everything is relative to a common base value.

There were a couple of things I learnt about rem from the podcast:

1. A typical approach to sizing is to set the baseline to a percentage of the normal browser default font size of 16px. The normal number to see floating around the internet for this is 62.5%, which sets the baseline size to 10px. The reason a percentage is used is that this will scale up and down appropriately if the user has selected a larger or smaller font size.
2. It can be useful to set the baseline size to a base 10 value - for example, 10px (or the
   percentage equivalent). The reason for this is is that it allows for easy conversion between
   common pixel values to rem. For example, a 32px margin could be expressed as 3.2rem, while a font
   size could be expressed as 1.6rem.

### Pixels

I use pixels pretty much only for positioning (although an absolute positioning like this is always as a
last resort). I also tend to use pixels for defining a base border radius since, unless corners are
super rounded, the numbers involved tend to be small and difficult to reason with in rem. It was an
interesting observation about how pixels used to be _extremely_ widely used before they fell out of
favour - for no particular reason. Pixels continue to be used a lot in graphic design, and for a lot
of websites where relative baseline sizing is not required. For me, I find that using pixels for
measurements, even with aids such as variables, leads to brittle and hard to work with styles. 

### Other units

Just like Scott and Wes in the Syntax podcast, I don't generally find a need for the many other
units available in CSS. I have always been curious to hear about use cases for slightly weird units
like centimeters and inches, and was interested to find that these units are generally useful for
print stylesheets - in particular specialist paper formats such as envelopes. 

---

Overall, I found listening to this particular episode gave me a great opportunity to reflect on the
opinions I hold regarding CSS units, and why I have decided on the approach I use. 
