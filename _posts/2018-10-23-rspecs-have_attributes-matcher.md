---
layout: post
title: "RSpec's `have_attributes` matcher"
description: "`have_attributes` is a convenient matcher for service or controller transactions which update models."
category: TIL
tags: [til,technology,rails]
---

I've been working on rewriting some legacy feature tests that have been unmaintained for several years as system
tests. One of the most convenient methods I have found while creating these tests is [`have_attributes`](https://relishapp.com/rspec/rspec-expectations/docs/built-in-matchers/have-attributes-matcher). 

The RSpec documentation I linked to above is a great overview of the matcher. I have found that it's
useful to matching the result of a service object, processor or even a controller action when we
expect the resulting model, or models to have particular attributes set, but do not need to match on
the entire object. 

Here's a simple example of `have_attributes` in action:

``` ruby
class WidgetCreator 
  def create
    Widget.create(status: :enqueued)
  end
end

RSpec.describe WidgetCreator do
  describe ".create" do
    subject { WidgetCreator.new.create }

    it "creates the widget" do
      expect { subject }.to change(Widget, :count).by(1) 
    end

    it "marks the widget as enqueued" do
      expect(subject).to have_attributes(status: :enqueued)
    end
  end
end
```

`have_attributes` accepts a single attribute key-value pair, or multiple. If multiple attributes are
provided, then all keys and values must match. This matcher also seems to function against any other
object which exposes attributes using simple setter and getter methods - like `ActiveModel::Model`,
`Struct` and `OpenStruct`. This is based on the
[implementation](https://github.com/rspec/rspec-expectations/commit/6f975b08c996b1014654334229d5d4b020055690#diff-3d34526f651a63dfdd65fe70231f9d26R59)
using `__send__` to read each attribute key from the actual object before comparing the value.
