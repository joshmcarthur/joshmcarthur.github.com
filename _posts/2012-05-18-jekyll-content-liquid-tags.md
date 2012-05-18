---
layout: post
title: "Jekyll Content Liquid Tags"
description: ""
category: 
tags: []
---

For the last week after deploying my new blog to [joshmcarthur.com](http://joshmcarthur.com) instead of a 'blog' subdomain, and implementing a new design and back-to-basics blogging engine, I've noticed that my markdown wasn't being parsed properly (/at all). 

Originally this was hard to spot - my posts had been migrated from Blogger, to Tumblr, out of Tumblr, transformed from HTML to Markdown, imported into an [Octopress](http://www.octopres.org) blog, and then transferred to this blog. After this process, most of them weren't in very good shape anyway, but it was still hard to spot because my embedded [gists](http://gist.github.com) were still being rendered - in fact anywhere where I had used actual HTML markup was fine.

After transferring markdown engines, a lot of Google and Stackoverflow searching and all-round frustration, I noticed that Jekyll mentioned two Liquid tags that could be used to interpolate content into a page:

* `content`, and
* `page.content`

I had considered these to be the same - one was just a namespaced one, like a convenience method. I was actually wrong about this, as they perform two slightly different functions:

The `content` tag outputs the contents of the file being built, and also processes the contents of that file - i.e. if it is a Markdown file, it parses the Markdown, if it is Textile, it parses the Textile, etc. etc. It also scans the output for other Liquid tags and does any further processing needed for these.

The `page.content` tag, on the other hand, just outputs whatever the content is. It's basically just the first part of the `content` tag - the file reading bit, without any of the processing.

I had been using `page.content` in my layouts, as I liked the idea of the namespaced tag better - as soon as I changed this to use `content` everything worked. I just wish it hadn't taken me a week to sit down and figure that out, instead of blaming everything else but me!