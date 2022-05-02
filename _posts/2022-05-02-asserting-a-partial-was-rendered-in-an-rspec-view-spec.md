---
layout: post
title: "Asserting a partial was rendered in an RSpec view spec"
description: "A quick tip on using RSpec spies to assert when a template is rendered"
category: TIL
tags: [til, rails, testing, rspec]
---

View specs are _great_. While I always keep in mind they are a _unit_ test and
do not test the full integration of a feature, I find that they are fantastic
for asserting around all the edge cases of a feature - things like the expected
validation messages showing up, or buttons appearing or disappearing based on
different scenarios. I used to use system tests for this kind of thing, and find
that these get really slow and fragile over time, while view specs stay blazing
fast.

Often, I'll break a template up into smaller pieces. Rails has a mechanism for
this called _partials_. I'll often break up things that are either their own
"thing" (like a "card" display for an object, or "share links" for an object),
or things that have some logic wrapped around them that I want to keep contained
(for example, a button with a permission check wrapped around it).

When I'm testing such templates with a view spec, I will often have a view spec
for the main template, and then another view spec for any more complex partials.
In this scenario, I want to assert in the main template that the partial was
rendered, but I don't mind too much _what_ is rendered, since I have another
view spec specifically for that partial that checks that.

In this case, I've found that RSpec spies are a great way to do this. Spies are
set up ahead of the test run, record interactions with themselves, and then
allow the calls that they received to be asserted against. RSpec spies also have
a handy method called `and_call_original`. This records the call, but then
invokes the original method. I can use this to record that a particular call to
`render` was received, but then still actually render the partial.

Here's an example:

```ruby
require "spec_helper"

RSpec.describe "widgets/show.html.erb", type: :view do
  it "renders the 'edit_button' partial" do
    assign(:widget, Widget.new)
    allow(view).to receive(:render).and_call_original
    render

    expect(view).to have_received(:render).with("widgets/edit_button", widget: widget)
  end
end
```

This test catches if the correct partial is not rendered, or if unexpected
locals are passed to the partial, but doesn't require me to assert in this spec
exactly _what_ the partial might render - I can put that in the partial spec.

I've found this is quite a handy technique and helps to make it quick and easy
to test templates, since it allows the test to be super focussed on what the
_current_ template under test is doing without worrying about any conditions the
parent template might otherwise need to take into account. It also allows for
some nice dependency injection into the partial spec, since the locals can be
adjusted in the spec (for example, to pass a different 'user' local, or a
feature flag stub or something like that). Changing these settings just for one
partial in a wider template would not otherwise be possible without splitting up
the template into partials, and the template spec into partial specs.

This technique is also a candidate for refactoring into a custom matcher for
view specs. I won't cover that in this post, but since `allow(view).to receive(:render).and_call_original` doesn't actually effect how templates are
rendered, you could quite easily run this before _all_ view specs, and then
support a matcher like `expect(view).to have_rendered_template()` - which is
very similar to what the
[`rails-controller-testing`](https://github.com/rails/rails-controller-testing/blob/master/lib/rails/controller/testing/template_assertions.rb)
gem does - but in a view spec rather than a controller spec (though I
suspect this gem probably _would_ work with a view spec since a view spec
defines an anonymous controller under the hood).
