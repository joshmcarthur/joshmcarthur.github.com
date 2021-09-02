---
layout: post
title: "Access ActionView context in an RSpec test"
description: "How to access a view object in an RSpec test"
category: TIL
tags: [til,rails,testing]
---

I recently created a Presenter object to wrap around an `ActiveStorage::Blob`
that I wanted to decorate with some presentation methods for things like a human
file size and content type.

The initialisation signature for my presenter looks like this:

```ruby
class MyPresenter < SimpleDelegator
  def initialize(obj, view_context)
    super(obj)
    @view_context = view_context
  end

  def human_file_size
    @view_context.number_to_human_size(byte_size, precision: 1)
  end

  # more presentation methods...
end
```

I went to test this, and got a bit stuck! I needed to provide a view context to
this class that I could call view helpers on. I could pass in a double, but
would then have to stub out every single view helper that the presenter used.
This would mean my tests would be testing my stubs, not the actual behaviour. I
could use a `double.as_null_object`, but that assumes that all the helpers are
OK to return `nil` - that's an _extremely_ uncommon thing for a view helper to
do!

I stopped and thought for a minute - I know that there are several types of
RSpec tests where you can access a view context - particularly `controller` and
`view` specs. I decided to begin my investigation with view specs, since this
was most closely aligned with what I was trying to test.

I started with the source of rspec-rails, particularly
[`lib/rspec/rails/view_rendering.rb`](https://github.com/rspec/rspec-rails/blob/d2a9e0e1b18d7d0d95b98dfa6b31eadd8d1b3985/lib/rspec/rails/view_rendering.rb).
It _sort of_ looked relevant, but it looked like it was using a lot of methods
coming from elsewhere - things like `controller`, and `lookup_context`.

Next, I looked to see where this module was used, and there I found
[`lib/rspec/rails/example/view_example_group.rb`](https://github.com/rspec/rspec-rails/blob/d2a9e0e1b18d7d0d95b98dfa6b31eadd8d1b3985/lib/rspec/rails/example/view_example_group.rb).
This looked even more relevant - I could see things like controllers, and
helpers being set up. Great! All of these were using a method named `view`,
though, and while the method documentation for this looked relevant - "The
instance of `ActionView::Base` that is used to render the template." - the
actual method body just returned the value of `_view` - and this wasn't
instantiated inside this module.

Looking at the top of this module, I could see an include from Rails itself -
`include ActionView::TestCase::Behavior`. This was a real giveaway, because all
of the other top-level includes were for other modules from within rspec-rails.

I switched over to the Rails repository, and headed into `lib/action_view` to
find this class, and I found it at
[`actionview/lib/action_view/test_case.rb`](https://github.com/rails/rails/blob/90357af08048ef5076730505f6e7b14a81f33d0c/actionview/lib/action_view/test_case.rb).

Within this class, I found the
[`view`](https://github.com/rails/rails/blob/90357af08048ef5076730505f6e7b14a81f33d0c/actionview/lib/action_view/test_case.rb#L203)
method. This method was aliased to `_view`, which was what RSpec was using.

In
[`setup_with_controller`](https://github.com/rails/rails/blob/90357af08048ef5076730505f6e7b14a81f33d0c/actionview/lib/action_view/test_case.rb#L104),
I could see that the `@controller` variable was set to an instance of
[`ActionView::TestCase::TestController`](https://github.com/rails/rails/blob/90357af08048ef5076730505f6e7b14a81f33d0c/actionview/lib/action_view/test_case.rb#L13).
Neat! This means that the set up of a view context is entirely contained to this
class, and I can do exactly what the view spec module is doing - include
`ActionView::TestCase::Behaviour`, and then access the `view` method in my spec
to use the view context.

As an example:

```ruby
RSpec.describe MyPresenter, type: :presenter do
  include ActionView::TestCase::Behavior

  describe "#file_size_human" do
    it "returns the expected value" do
      format = ActiveStorage::Blob.new(byte_size: 1500)
      expect(described_class.new(format, view).file_size_human).to eq "1.5 KB"
    end
  end
end
```