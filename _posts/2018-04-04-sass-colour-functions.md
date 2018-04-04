---
layout: post
title: "SASS Colour Functions"
description: "SASS Colour Functions make working with colour variables in SASS much easier"
category: TIL 
tags: [til,technology,sass]
---

I've been implementing a style guide this week, and in particular have been trying to focus on creating clean, decoupled, and reusable components. 

Part of this effort has involved ensuring that all "global" settings that are represented in the style guide are contained in a single settings file. A perfect example of one of these settings is the colour palette.

In order to try and avoid defining too many colours unnecessarily, I've been working a lot with SASS colour functions, and wanted to talk about those today. 

#### scale_color

[Documentation](http://sass-lang.com/documentation/Sass/Script/Functions.html#scale_color-instance_method)

This function is great for 'tinting' a colour. For example, if you have a palette colour defined, say `$green: #00ff00;`, you can lighten it with `scale_color($green, $lightness: 15%)` to make the colour 15% lighter. `scale_color` has some minor details relating to how it changes the lightness in a relative sense - for a more absolute measurement, then there is [`adjust_color`](http://sass-lang.com/documentation/Sass/Script/Functions.html#adjust_color-instance_method).

#### rgba

[Documentation](http://sass-lang.com/documentation/Sass/Script/Functions.html#rgba-instance_method)

`rgba` is great for introducing an alpha value to a palette colour. I've been using this a lot for things like button states, where the background colour should be 85% opaque. It's very simple to use, as it can accept either red, green, blue and alpha arguments, or a Sass "color" type and alpha arguments. A Sass color type can be basically any representation of a color - named colours (like "green"), and hex values (like "#00ff00") are most common. Variables are also supported.

As an example of introducing alpha to a colour value, given a color palette variable of `$green: #00ff00;"`, RGBA can be used to change the alpha of the color to 85% as follows: `rgba($green, 0.85)`. 

---

These functions are incredibly useful for enabling stylesheets to stick to a small set of core variables, and simply adjust these, rather than adding variables for every possible variant of a colour. There are many, many more utility functions [documented](http://sass-lang.com/documentation/Sass/Script/Functions.html#rgba-instance_method) on the sass-lang site, and I'm going to be spending a lot more time investigating these more to further improve my componentized styles.


