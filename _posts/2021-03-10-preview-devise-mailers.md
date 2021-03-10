---
layout: post
title: "Preview Devise mailers"
description: "How to use ActionMailer::Preview to preview what email Devise will generated"
category: TIL
tags: [til,rails,devise]
---

I use ActionMailer::Previews whenever I am implementing a transactional email.
They're a super handy way of working with email development, and I've even
enabled them in UAT environments before so clients and designers can check the
email easily.

In many apps, nearly all the transactional email is actually sent by Devise, so
I wanted to set up a ActionMailer preview for the emails Devise sent. Someone on
StackOverflow have already [put together](https://stackoverflow.com/a/25860079)
the answer, but I made some small changes based on the specific application:

{% gist 7fa1501eda3f454f4c095ea35506fc69 %}

There are a couple of notes I have:

1. I had to comment out the `confirmation_instructions`, since I don't have the
   `:confirmable` strategy active on this app. It fails with a non-specific
   error message about being unable to find the route (e.g. it gets all the way
   to rendering the email template before it fails).
2. There's probably a way of introspecting the Devise strategies to figure out
   dynamically which preview methods to generate, if you wanted to make this
   reusable across different apps. You can see all the mailer methods available
   for Devise in IRB with `Devise::Mailer.methods - ApplicationMailer.methods`,
   or in pry with `show-source Devise::Mailer`.
3. You can have as many preview methods per mailer method as you want - e.g. if
   you had different content or links that were generated, you can have
   different preview methods that build different data (e.g. if an admin user
   had a different subject or email content, you could have one preview for the
   admin user email, and one for the normal user email).
4. This class looks up the first user and uses that. I usually use
   `FactoryBot.build_stubbed` here, because I want a record that looks like it
   is persisted, but I don't actually need it in the database to render the
   email.
5. You could use `Devise.friendly_token` instead of "faketoken" if you wanted to
   have something that looked a bit more realistic.
