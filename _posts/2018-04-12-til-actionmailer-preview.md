---
layout: post
title: "TIL: ActionMailer Preview"
description: "TIL that emails can be previewed using a tool baked right into Rails 4.1+"
category: TIL
tags: [til,technology,rails]
---

It's been a while since I've worked with transactional email directly with Rails. This is because I've previously been working on some larger projects that have justified the use of an external mailing system like Mandrill, where email templates were used to generate email within that system, and sending an email from the Rails app was just an API call.

Recently, I've been working on applications for smaller businesses, and that's a problem I approach quite differently. Smaller businesses really need something that will work, and continue to work, with very little ongoing investment. Because of this, when I've got the need to send transactional email for a client like this, I go back to the bedrock - SMTP and ActionMailer.

Because I haven't worked with ActionMailer for some time, I seem to have missed a fantastic feature that I just learned about today. It's even in the [Guides](http://guides.rubyonrails.org/action_mailer_basics.html#previewing-emails), so I'm annoyed at myself for missing it!

It turns out, since Rails 4.1, there is built-in support for rendering either an HTML or plain-text version of an ActionMailer template, right in a web browser. This allows for easy iterative development and testing, and since the preview follows exactly the same code paths that sending does (up to actual delivery of course!), you can see the final product in the browser - with inlined CSS, rewritten markup, and any other enhancements you've included.

Writing a preview is very easy - so easy in fact that Rails will do it for you by default with `rails generate mailer`:

``` bash
=> rails generate mailer user
      create  app/mailers/user_mailer.rb
      invoke  erb
      create    app/views/user_mailer
      create    app/views/layouts/mailer.text.erb
      create    app/views/layouts/mailer.html.erb
      invoke  rspec
      create    spec/mailers/user_spec.rb
      create    spec/mailers/previews/user_preview.rb
```

The preview class is very simple - one or more methods can be defined, with each method expected to invoke a corresponding mailer method. The preview class can take whatever steps it needs to to set up the data required to prepare a particular email, so long as the `Mail` object returned from a mailer call is returned from the method.

Here's an example of a preview class:

``` ruby
class UserMailerPreview < ActionMailer::Preview
  def confirmation
    UserMailer.confirmation(FactoryBot.build(:user))
  end

  def password_reset
    UserMailer.password_reset(FactoryBot.build(:user))
  end
end
```

Rails creates a simple navigation structure for previews - going to `http://localhost:3000/rails/mailers` will serve an index of all the available preview classes, and then going to a particular preview name (in the example above, `http://localhost:3000/rails/mailers/user`) will serve an index of all the mailer methods available for testing:

![Mailer preview index listing](/img/posts/actionmailer-preview-listing.png)

Clicking on a particular mailer method will present the email within the web browser, showing the email metadata (recipient, subject, bcc etc) at the top of the page, with the HTML or plain text version selectable to show in the bottom. Updating the mailer template or mailer itself will be autoloaded as usual, so the mailer preview can just be refreshed to see the latest change.

![Mailer preview display](/img/posts/actionmailer-preview-display-html.png)
![Mailer preview display](/img/posts/actionmailer-preview-display-text.png)

This is a great feature built into Rails, and certainly something I've tried to emulate before with tools such as Mailcatcher and letter_opener. Finding little pieces of functionality built into the framework like this is always great, and continues to encourage me to keep an eye on the changelog!

