---
layout: post
title: "Generating error messages using ActiveModel::Errors"
description: "ActiveModel errors should have internationalised strings to customize the message. This post describes how to translate an error."
category: TIL
tags: [til,rails,technology]
---

`ActiveModel::Errors` are widely used in ActiveRecord and therefore Rails, and while custom messages
can be provided to each validation using the `message` key, it's much more flexible to instead pass
a symbol as the message, which will cause the message to be looked up using the internationalisation
framework provided by the `i18n` gem that is a dependency of Rails. Here are some examples:

``` ruby
validates :title, presence: true, message: "needs to be filled in"
validates :title, presence: true # Will use built-in validation message look up
validates :title, presence: true, message: :blank # ^ The same effect as the above
validate do
  errors.add(:title, :contains_today_i_learned) unless title.includes?("TIL")
end
```

Using an internationalised message is great for a number of reasons:

1. It keeps strings out of your model
2. It allows for custom error messages to be constrained to a single location
3. (The obvious) - it allows error messages to be customized based on the current locale

Once these custom errors are built into your model, you may want to add a test to assert that the
expected error messages are generated. You can assert against the string itself of course, however
if you run your tests in multiple locales, or just want to keep validation message strings out of
your model TEST as well as your model, the following method can come in handy.

When you run validations, an instance of `ActiveModel::Errors` is available as the return value of
the `errors` method on your model instance. This instance is normally used for accessing all the
validation errors on a model, but it also has a number of convenience functions - in particular, the
one we're interested in is called **`generate_message`**. This method accepts an attribute, and the
custom error (the symbol passed to the `message` option of your validation, or a built-in validation
such as `presence`, `inclusion`, etc., and returns the string form of the message. It will respect
the current setting of `I18n.locale` when looking up error strings.

Here are some examples of looking up errors on a model (the instance of which is called `subject` in
this example):

``` ruby
subject.errors.generate_message(:title, :blank) 
# => "can't be blank"

subject.errors.generate_message(:title, :contains_today_i_learned)
# => "must include the category 'TIL'"

I18n.locale = "mi-NZ"
subject.errors.generate_message(:title, :contains_today_i_learned)
# => "me whakauru i te tuhinga 'TIL'"
```

For more information on the I18n translation format, and exactly how these above messages are
resolved, see the [I18n Rails Guide section on error message
scopes](https://guides.rubyonrails.org/i18n.html#error-message-scopes).

