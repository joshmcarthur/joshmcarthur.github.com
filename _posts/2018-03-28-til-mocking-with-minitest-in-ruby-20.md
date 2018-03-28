---
layout: post
title: "TIL: Mocking with Minitest in Ruby 2.0+"
description: "TIL that the Ruby standard library includes support for mocking"
category: TIL
tags: [til,technology,rails,minitest]
---

I normally work within an RSpec testing envionment, but I definitely enjoy working with more traditional Test::Unit tests when I get the chance. 

Today I discovered that Minitest, the testing toolkit that [has been part of the Ruby standard library since 2.0](http://ruby-doc.org/stdlib-2.0.0/libdoc/minitest/rdoc/MiniTest.html) has built-in support for mocks and stubs.

To use this in a Test::Unit test, simply `require "minitest/mocks"`.

### Mocking

It looks like a mock object has to be specifically made. Minitest/Mocks does not include double support - you'll need something like Mocha for that. The method signature on Minitest::Mock is: `expect(:method_name, return_value, [args])`.

Here's an example:

``` ruby
message_sender = Minitest::Mock.new
message_sender.expect(send_message, true, [{email: "test@example.com", message: "Test"}])
result = message_sender.send_message(email: "test@example.com", message: "Test")
assert result, "Message sends"
message_sender.verify
```

A major difference from Rspec mocks to be aware of is that the `verify` method must be called on the mock object to actually check that the expected methods were returned.

### Stubbing

Minitest also includes basic support for stubs. The method signature for stubs is: `ObjectUnderTest.stub(:method_name, stub_value, &block)`. **Minitest does not have an unstub method** - instead, it is expected that the test code that requires the stub should go inside the block passed to `stub`, and minitest will automatically unstub when the block completes.

Example:

``` ruby
message_sender = MessageSender.new
message_sender.stub(:perform_deliveries?, true) do
  message_sneder.send_message(email: "test@example.com", message: "Test")
end
```
