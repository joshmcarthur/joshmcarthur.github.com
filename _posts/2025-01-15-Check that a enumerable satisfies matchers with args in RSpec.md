---
title: Check that an enumerable satisfies matchers with args in RSpec
---

> Note: I discovered this API based on a suggestion from an AI editor assistant, just to disclaim that.

When creating an RSpec test against an enumerable, [`rubocop-rspec`](https://gem.wtf/rubocop-rspec) will enforce that the `all` matcher be used instead:

```ruby
it "only returns odd numbers" do
  odd = [1 3 5]
  expect(odd).all(be_odd)
end
```

This is fine for a matcher that doesn't require any args be passed to it, but what do we do in the case where we _do_ require args?

Take this example:

```ruby
it "shows the family member names on the page" do
  family_names = %w[Alice Bob Kenny]
  expect(family_names).all(have_content)
end
```

Now that fails, because, quite rightly, `has_content?` expects an argument. So how do we pass an argument to the matcher? We can use `satisfy`, a block matcher:

```ruby
it "shows the family member names on the page" do
  family_names = %w[Alice Bob Kenny]
  expect(family_names).all(satisfy { |name| page.has_content?(name) })
end
```

Using matchers like this means that your test output will be most useful on failure. Instead of a `.each` "failing fast" when it encounters an item that doesn't pass the test,
RSpec will report on `all` more comprehensively:

```
  expected ["Alice", "Bob", "Kenny", "Quentin"] to all satisfy expression `has_content?(page_name)`

          object at index 3 failed to match:
             expected "Quentin" to satisfy expression `has_content?(page_name)`
```

There are lots of other checks you can do within `satisfy`: https://rspec.info/features/3-12/rspec-expectations/built-in-matchers/satisfy/
