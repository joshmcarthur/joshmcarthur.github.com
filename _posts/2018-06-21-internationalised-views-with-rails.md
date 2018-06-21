---
layout: post
title: "Internationalised views with Rails"
description: "Rails' internationalisation has built-in support for providing view templates for different locales"
category: TIL
tags: [til,technology,rails]
---

Rails has great built in support for internationalisation. Generally, many people, including myself, end up focussing their efforts on internatising strings - for example, changing form labels, errors, and maybe some minor copy like headings, using `I18n.t` (an alias for `translate`), which looks up which string to return for the current locale (determined from `I18n.locale`, which can be set from a cookie, geo lookup, param, or whatever).

I've recently been working on an app that's pretty well established in NZ, and is moving some operations to Australia. As part of this move, they have a bunch of content that needs to be worded slightly differently (and some behaviour in core models that has to work differently based on the locale, but that's a story for another blog post). Something that often gets skipped over in internationalisation is the ability for Rails to automatically serve templates for the current locale.

The [Rails Guides](http://guides.rubyonrails.org/i18n.html#localized-views) lay out localised views with the following description:

> Let's say you have a BooksController in your application. Your index action renders content in app/views/books/index.html.erb template. When you put a localized variant of this template: index.es.html.erb in the same directory, Rails will render content in this template, when the locale is set to :es. When the locale is set to the default locale, the generic index.html.erb view will be used. (Future Rails versions may well bring this automagic localization to assets in public, etc.)

This is certainly true, but it's worth exploring a little more. First of all, while the example uses Español as the locale (determined by the es locale code), any locale that your Rails app is aware of will work just the same. For my example, I have two locales within my application - "en-NZ" and "en-AU". This means that I can keep my existing templates named as they are (e.g. "app/views/books/index.html.erb"), and provide a new template containing the copy for Australia in "app/views/books/index.en-AU.html.erb"). When the locale is set to the default of NZ, the default template will be used. When the locale is set to en-AU, the matching template will take precedence and will be used instead.

The main thing to watch out for with localised views is the extent to which you are duplicating content. It's quite simple to copy and paste a file, add the locale to the filename, and change a couple of words in the template - but this isn't particularly maintainable if your template also has a bunch of content that does not require translation. To avoid this problem, carefully consider your template structure. If you have a section of a template that needs to be adjusted for each locale, consider refactoring that content into a partial. If the partial itself ends up particularly simple, you might then refactor to go back to a simple string lookup. Whichever approach you end up with, always try and reduce the content requiring per-locale translation to the smallest unit. This ensures that you have minimal duplication between views, while still providing all of the advantages.
