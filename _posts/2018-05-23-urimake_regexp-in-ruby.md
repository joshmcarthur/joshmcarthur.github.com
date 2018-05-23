---
layout: post
title: "URI.make_regexp in Ruby"
description: "Rather than finding an imperfect URI validation regexp, use the comprehensive one built into Ruby."
category: TIL
tags: [til,technology,rails]
---

Recognizing or validating URIs in a string or strings of text is a fairly common problem. 
Unfortunately, just as common is the range of regular expressions that exist to validate URIs
(or, generally, URLs). There are many, many StackOverflow answers and blog posts that lay out
a massive variant of expressions in function and quality, and it's not the easist form to understand.

Fortunately, the Ruby programming language comes with a very capable regexp for parsing URIs - it's just
a matter of knowing where to look. Where to look, in this case, is the [URI module](https://docs.ruby-lang.org/en/2.4.0/URI.html#method-c-regexp).  `URI.regexp` will match most valid URIs, using `=~`, `scan`, `gsub`, or any other string method that deals with regexp matching. Additionally, an array of schemes can be passed into the `regexp` method, which will restrict the returned regexp to match these schemes only. This regexp is particularly useful as the capture groups that are returned include the parsed components of the URI, allowing for very precise control of how the string is processed from there.

Examples:

``` ruby
irb(main):001:0> URI.regexp.match("https://joshmcarthur.com/posts?page=2#top").to_a
=> ["https://joshmcarthur.com/posts?page=2#top", "https", nil, nil, "joshmcarthur.com", nil, nil, "/posts", "page=2", "top"]
```

``` ruby
irb(main):009:0> URI.regexp(["ftp"].match("https://joshmcarthur.com/posts?page=2#top").to_a
=> []
```