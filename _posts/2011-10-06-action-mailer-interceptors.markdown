---
layout: post
title: "Action Mailer Interceptors"
date: 2011-10-06 16:51
comments: true
categories: howto
tags:
  - ruby on rails
  - programming
  - actionmailer
---

ActionMailer Interceptors are a great way to test the full stack of your mailing in Rails from the generation from data through to receiving the email in your client. They are similar to ActiveRecord's `before_x`-type callbacks, and let you change something about the message being sent right before it's actually dispatched.

The most common purpose I use these for is to redirect mail being sent from the application to either my Inbox, or some shared account (if it's on a project where I'm not the only developer). This lets me make sure that the HTML in the message is displayed properly, and that the data gets injected into the content the way I expect it to be.

Here's a quick example of how to use a Mail interceptor for this purpose:

{% highlight ruby %}

# lib/development_mail_interceptor.rb
class DevelopmentMailInterceptor
  def self.delivering_email(mail)
    mail.subject = "<#{mail.to}> #{mail.subject}"
    mail.to = "me@mywork.co.nz"
  end
end

# config/initializers/mail_interceptors.rb
require 'development_mail_interceptor'
ActionMailer::Base.register_interceptor(DevelopmentMailInterceptor) if Rails.env.development?

{% endhighlight %}

...and give one of your mailers a go.

This is a very simple example, of course, but there are a lot of uses for this type of thing - logging & auditing, checking against quotas, analysis, etc. etc.

What really triggered this post though, was a odd problem I came across when trying to get this interceptor to work. An ActionMailer method can be triggered using one of two methods: either `deliver` or `deliver!` - the main difference between the two is that the second will throw exceptions if it cannot be sent, which is why I tend to prefer using it. Something to keep in mind though, is that using `deliver!` will call any registered Mail Observers, but **not Interceptors** - meaning that your mail will be sent unaltered.

It really was a frustrating process to debug, but after looking at the [Mail gem](https://github.com/mikel/mail) source code (ActionMailer back-ends onto this gem for it's mail setup and delivery processes), in particular the [Message class](https://github.com/mikel/mail/blob/master/lib/mail/message.rb#L227), I noticed this crucial difference between the two. Resolving the issue is, of course, as simple as using `deliver` - without the exclamation mark. After that, your Interceptors will be triggered just as they should be.
