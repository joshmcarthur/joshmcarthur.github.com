---
layout: post
title: Asserting method calls with Minitest
---

Minitest has support for stubbing via
[`Minitest::Mock`](https://www.rubydoc.info/gems/minitest/Minitest/Mock). This
is a good fit for providing fake results to a caller, but what about asserting
that a method is actually called?

To do this, you can leverage the fact that if the stubbed value is callable, it
will be called. This means that you can provide a mock, then expect that the
mock will receive `call` with the expected args (and return the return value
that you need):

```ruby
perform_job = Minitest::Mock.new
# expect(method name, return value, [args])
perform_job.expect(:call, nil, [my_job_arg])
SlowJob.stub(:perform_now, perform_job) do
  method_that_triggers_slow_job
end

perform_job.verify
```


