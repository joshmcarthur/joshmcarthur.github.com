---
layout: post
title: "Document your code with Tomdoc"
description: ""
category: 
tags: []
---

Documentation in Ruby on Rails apps tends to be somewhat of a hit-and-miss affair, particularly within non-product organizations. In this blog post, I'll run through how [Tomdoc](http://tomdoc.org) has helped my code become clearer and easier to maintain, with very little overhead.

---

First, a small explanation about Tomdoc. It is effectively a spec that dictates a way of writing inline documentation in comment blocks, in a similar way to ri and rdoc, but without some of the overhead. It was created by [Tom Preston-Werner](http://tom.preston-werner.com/) of [Github](https://github.com) fame, who felt that tools such as RDoc required too much verbosity and effect to properly document code.

Tomdoc has been written specifically to be read by humans, unlike other documentation systems that are generally optimized for machine parsing and formatted display. Tomdoc makes the very sensible assumption that in most cases, the person reading the documentation will be looking at the code, and so removes the need for any special kind of markup. 

The [Tomdoc](http://tomdoc.org) spec has a detailed example of what a Tomdoc documentation section may look like, so I'll skip over the big example, and instead drill down to how I use it to write more maintainable code.

Effectively, I use Tomdoc the same way as I would an RSpec integration test - within my documentatation, I not only explain the API of the method, but also the context of how and where this method is used - for example:

{% highlight ruby %}
  # Public - Record that this deal has been viewed by a user
  #
  # This method facilitates a given user having 'read' and 'unread'
  # deals. When a deal is displayed to the user, it should call this method,
  # which will add a DealView record for the card and user id, if one
  # does not already exist.
  #
  # user - The user who viewed this deal
  #
  # Returns the found or created dealview
  def viewed_by!(user)
    DealView.find_or_create_by_deal_id_and_user_id(:deal_id => self.id, :user_id => user.id)
  end
{% endhighlight %}

Within this method, I not only define the visibility (Public) of the method, and provide a short description of what the method does, but I also describe briefly where and  how the method is used. I then go on to define the parameters that the method accepts, and what the method returns.

By commenting my code in this format, I achieve benefits in number of areas:

1. It becomes easier for new developers to understand the relationships between different areas of code
2. The documentation forms a contract which future changes to the method should conform to
3. Writing the documentation forces me to think about the best way to code the method, and how it may need to interact with other areas of the application

Overall, I've noticed that I've had a much better understanding of how components of applications I've been working on interact since I started documenting the code I write, and have been able to pass on this understanding to colleagues and others - that for me, indicates that this type of documentation works really well with an opinionated  framework like Rails, and a untyped language like Ruby, providing a flexible specification to build system knowledge without getting in the way or slowing things down.

---

> Just as a sidenote, I've also forked and made some minor improvements to an existing fork of tomdoc, that adds the ability to generate formatted documentation from a source tree. My change adds the ability to pass in a folder to parse documentation from, and adds nicer formatting and navigation controls. You can see my fork at [https://github.com/joshmcarthur/tomdoc](https://github.com/joshmcarthur/tomdoc)
  
 
  
