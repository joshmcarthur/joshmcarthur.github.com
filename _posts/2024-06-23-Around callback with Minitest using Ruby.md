---
title: Implementing an around callback with Minitest using Ruby
---

I use both RSpec and Minitest, but prefer Minitest. It's not quite as
feature-rich as RSpec, but I find that I prefer the tests I write in Minitest -
they are more Ruby-ish, and aren't as reliant on RSpec's DSL to work.

I don't use `around` callbacks in RSpec very often, but it is something I
recently found myself wanting to do in Minitest. Since I couldn't find a
built-in way to achieve this, I fell back to just using Ruby - in this case,
proxying the `test` method.

Just to be clear, in RSpec, an `around` callback is passed the example as a
block arg. Typically, you'll take an action _before_ running the example, then
run the example, then take an action _after_ running. This is often used for
setting a variable for the duration of a test, instrumentation, that kind of
thing:

```rspec
describe Thing do
  around do |example|
    puts "Running before example"
    example.run
    puts "Running after example"
  end
end
```

The thing with Minitest/Test::Unit is - it's just Ruby. To achieve something
similar with Ruby, we can just wrap Minitest's `test` method to take the action
we want before and after calling the _actual_ test method:

```ruby
class ThingTest < Minitest::Test
   def self.wrapped_test(description, &)
    test(description) do
      puts "Running before test"
      yield
      puts "Running after test"
    end
  end

  wrapped_test "does foo" do
    assert_equals 1, 1
  end
end
```

Because this is just Ruby, `wrapped_test` can be moved to a module, or a base
test class to be reused by other tests. It's also entirely possible to create
multiple test wrappers, and because they're declarative, they'll have nice
descriptive names of _what_ they are wrapping. You can even wrap wrappers - it's
Just Ruby!
