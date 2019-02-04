---
layout: post
title: "Internationalised ActionMailer Subjects"
description: "I18n has handy built in support for translating subjects. Here's how to do it."
category: TIL
tags: [til,technology,rails]
---

I'm a big fan of keeping strings out of my application code. It's a pattern I first came across with
Android [string resources](https://developer.android.com/guide/topics/resources/string-resource),
and since then I've been using tools just like the [`i18n`
gem](https://github.com/ruby-i18n/i18n) to abstract content away from code. 

Something mentioned directly in the [Rails I18n
guides](https://guides.rubyonrails.org/i18n.html) that I really like to see used myself is the
built-in support for translating mailer method subjects. As the guides mention:

> If you don't pass a subject to the mail method, Action Mailer will try to find it in your translations. 
> The performed lookup will use the pattern <mailer_scope>.<action_name>.subject to construct the key.

&mdash;  https://guides.rubyonrails.org/i18n.html#translations-for-action-mailer-e-mail-subjects

This is a very handy trick, since email subjects are frequently the last remaining piece of content
that exists in mailers. Along with [translated
templates](https://www.joshmcarthur.com/til/2018/06/21/internationalised-views-with-rails.html),
making mailers that support multiple languages (or even just the default locale language), is easy,
with all strings moved to I18n locale files and templates.

By default, ActionMailer will use the mailer name and the action name as the I18n key if `mail` is
called without a subject option.

Here are some examples:

``` ruby
class UsersMailer
  def password_reset
    # Key is: users_mailer.password_reset.subject
    mail to: @user.email
  end
end
```

``` ruby
class Admin::AlertsMailer
  def alert
    # Key is admin/alerts_mailer.alert.subject
    mail to: @administrator.email
  end
end
```

Here would be the corresponding locale file for the above examples:

``` yaml
en:
  admin/alerts_mailer:
    alert:
      subject: "New Administrator Alert"
  users_mailer:
    password_reset:
      subject: "New Password Reset Request"
```

I feel that understanding I18n in Rails is a really undervalued skill. Frequently, understanding the
abstractions that I18n offer can lead to clean separation of content and logic, as well as inspiring
some abstractions in your own application. I look forward to continuing to learn more about what can
be done within the I18n framework.
