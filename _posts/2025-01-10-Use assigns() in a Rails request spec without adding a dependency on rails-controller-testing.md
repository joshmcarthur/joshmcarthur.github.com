---
title: How to use assigns() in a Rails request spec without a dependency
---

Several years ago, the Rails core team [advised](https://github.com/rails/rails/issues/18950) that controller tests/specs were
being discouraged, in favour of request specs. The basis for this was that
controller tests had more visibility into the internals of the controller, and
were not purely testing the HTTP interaction as request specs were.

This is valid, but one method I end up missing a lot from controller specs is `assigns` - as in (`expect(assigns(:widget)).to be_published`).
While the assertions available to controller tests are easily installable as a [gem](https://github.com/rails/rails-controller-testing), getting the `assigns` method back is super simple.

It's pretty common to put support modules into place - for example, in `spec|test/support/request_spec_helpers.rb`:

```ruby
module RequestSpecHelpers
  def assigns(key)
    controller.view_assigns.fetch(key.to_s)
  end
end
```

In Test::Unit, this can just be included into your `ActionDispatch::IntegrationTest`:

```ruby
class WidgetRequestTest < ActionDispatch::IntegrationTest
  include RequestSpecHelpers
end
```

And in RSpec, it can be included with config:

```ruby
RSpec.configure do |config|
  config.include RequestSpecHelpers, type: :request
end
```