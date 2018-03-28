---
layout: post
title: "TIL: let! and before order is important"
description: "When using let! and before in RSpec, the order is important"
category: TIL 
tags: [til,technology,rails,rspec]
---

I've just come across this issue. It's minor, but it tripped me up!

In RSpec, there are three methods I find myself using all the time:

1. `before` - this is equivalent to the `setup` method present in many assertion-based test frameworks, and runs before each test.
2. `let` - this is a lazy-evaluated variable that will be made available to the context of each test - BUT it is undefined until called for the first time.
3. `let!` - this is the "evaluate right away" version of `let`. It will run before each example and already be available at that point.

Normally, in a feature or integration test that require data to be present, there will be some standard code:

``` ruby
RSpec.describe "My cool feature", type: :system do
  let!(:widget) { FactoryBot.create(:widget) }
  before { visit "/widgets" }

  it "shows the widget" do
    expect(page).to have_content widget.name
  end
end
```

This is normally the pattern that I follow. 
What I found is that, especially for `let!` blocks where you want the data to be present
in the database _before_ the route is visited, the order of the `let!` and `before` matters.

In the below example the test fails, as the `let!` blocks actually run as they are evaluated, as in, after the `before` block:

``` ruby
RSpec.describe "My cool feature", type: :system do
  before { visit "/widgets" }
  let!(:widget) { FactoryBot.create(:widget) }

  it "shows the widget" do
    expect(page).to have_content widget.name
  end
end
```

`Failure: Unable to to find content: "My widget"`

There is an interesting [issue](https://github.com/rspec/rspec-core/issues/2040) lodged against rspec-core that has a bit more background as to why this happens, as well as some suggested workarounds. In my case, I just corrected the order of my `before` and `let!` calls to make sure the `before` block came after the `let!`s.

