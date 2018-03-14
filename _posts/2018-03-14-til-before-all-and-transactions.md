---
layout: post
title: "TIL: before(:all) callbacks run outside the test transaction"
description: ""
category: til
tags: [til,technology,rails,rspec]
---

While working on a feature test today, I learned that any database data that is modified 
in a `before(:all)` callback in an RSpec test is retained outside of the test run. This is documented quite clearly in the RSpec [documentation](https://relishapp.com/rspec/rspec-rails/docs/transactions), I just haven't had the opportunity to work with these types of callbacks regularly before.

The test I ran into issues with looked like this:

``` ruby
require "rails_helper"
RSpec.describe "MyFeature", type: :system do
  before(:all) do
    @widgets = FactoryBot.create_list(:widget, 5)
  end

  # ... tests
end
```

The first time this test ran against an empty database, the test passed, no problems. The test also ran fine on CI, even after repeated attempts. If I tried to run the test multiple times locally though, the second run onwards failed with a uniquenss constraint error on widget name (which had a unique index).

After reading the documentation, I found that while `before(:each)` callbacks run within the ActiveRecord
transaction that wraps each RSpec example, and therefore rollback any data modifications after the test completes, `before(:all)` does not. In the example of the test above, this meant that on the first test run, 5 widgets were being committed to my test database. The next test run, these widgets were already present, causing the uniqueness validation to be violated when widgets with identical names were created.

Generally, the most appropriate solution with this type of test data is to move the data being created in a `before(:all)` callback to a `before(:each)`, like so:

``` ruby
before(:each) do
  @widgets = FactoryBot.create_list(:widget, 5)
end
```

If this is the entirity of your callback block, you may as well make this a [`let` block](https://relishapp.com/rspec/rspec-core/v/3-4/docs/helper-methods/let-and-let) (but don't forget to understand when to use `let` vs `let!`):

``` ruby
let(:widgets) { FactoryBot.create_list(:widget, 5) }
```

If you are doing more complex set up in your `before(:all)` or cannot set up this data in `before(:each)` callback, the before all callback can still be used, it just becomes important to use a corresponding `after(:all)` callback to clean up the test data to prevent subsequent test failures:

``` ruby
before(:all) do
  @widgets = FactoryBot.create_list(:widget, 5)
end

after(:all) do
  @widgets.destroy_all
end
```

