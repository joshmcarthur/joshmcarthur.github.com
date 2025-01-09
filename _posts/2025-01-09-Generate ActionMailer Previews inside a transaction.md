---
title: Generating ActionMailer Previews inside a transaction
---

[ActionMailer Previews](https://guides.rubyonrails.org/action_mailer_basics.html#previewing-emails)
are a great way to provide some living documentation in the form of rendered
emails. They're also great for testing.

Often, in order to generate a preview, you might need to create a database
record - perhaps using fixtures, or a tool like
[factory_bot](https://github.com/thoughtbot/factory_bot). When you do this, you
might be surprised to see these records then show up and remain in your
database. This is because previews are not generated inside a rollback
transaction, so once they are in your database, they stay there.

To avoid this, I have a small patch to Rails which I apply using an initializer
to all the projects I work on that need previews:


```ruby
module RollbackingAfterPreview
  def preview
    ActiveRecord::Base.transaction do
      super
      raise ActiveRecord::Rollback
    end
  end
end

Rails.application.config.to_prepare do
  class Rails::MailersController
    prepend RollbackingAfterPreview
  end
end
```

It simply wraps the preview action of the `Rails::MailersController` in a
transaction which is rolled back after the action executes. This means that any
database updates made in the process of generating the preview are rolled back,
and not committed to the database.

I've been interested in committing this to Rails, as I think it's a reasonable
default behaviour to have. Unfortunately, when I tried to dig into it, I found
that I couldn't quite get my head around how to test the transactional part of
the patch, so it's remained something that I just patch myself when I need it.
Maybe it's useful to someone else.