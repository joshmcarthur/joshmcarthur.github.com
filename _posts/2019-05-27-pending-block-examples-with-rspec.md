---
layout: post
title: "Pending block examples with RSpec"
description: "How to mark entire describe/context Rspec blocks as pending"
category: TIL
tags: [til,techology,rspec]
---

I have known about the different ways of [marking tests as pending](https://relishapp.com/rspec/rspec-core/v/2-0/docs/pending/pending-examples)
in RSpec for some time. When working on a feature for which there are already tests (e.g. cloning a
similar feature where shared examples or a common starting point for tests can be used), it can be
extremely convenient to temporarily mark as test as pending like so:

``` ruby
describe "addition" do
  it "adds 1 + 1" do
    pending("#45: Implement addition")
    expect(subject).to eq 2
  end
end
```

Something that isn't covered in the documentation is how to do this for several tests at once. You
_can_ accomplish this by changing the `it` methods to `xit`, but this still requires each test to be
updated.

While researching how to do this, I stumbled across an interesting
[issue comment in
rspec-core](https://github.com/rspec/rspec-core/issues/1208#issuecomment-30009148), which mentioned
that:

> Currently pending 'doc string' is just an alias for it 'doc string', :pending => true. xit

This is interesting, because that means that `pending` is implemented as an RSpec tag, and I know
that tags can be applied to more than just specific examples - they can also be applied to example
containers (`describe`/`context`/`feature` etc)., and will merge their tags with each example.

Sure enough, adding a `pending` tag to an entire example block will cause all examples in that block
to be marked as pending. "Pending" means that the example will still be run, but the failure of the
example will not cause a test failure. What WILL cause a test failure is if the example runs and
_does not fail_ - this test fails because "pending" is meant to signal that the test SHOULD NOT pass
- if it does, this is an indicator that the pending tag can be removed from that example.

If you would like to mark a block of tests as pending regardless of their underlying pass/fail
status, the `skip` tag can be used instead. This will not even attempt to run the examples,
resulting in a faster test run. 

Here's a fuller example:

```
describe "Arithmetic" do
  it "adds 1 + 1 and equals 3" do
    expect(1 + 1).to eq 3
  end

  it "adds 1 + 1 and equals 2" do
    expect(1 + 1).to eq 2
  end
end
```

These examples can be marked as 'skipped' by adding the `skip` tag to the describe block:

```
describe "Arithmetic", skip: true`
```

Results in:


```
Arithmetic
  adds 1 + 1 and equals 3 (PENDING: No reason given)
  adds 1 + 1 and equals 2 (PENDING: No reason given)

Pending: (Failures listed here are expected and do not affect your suite's status)

  1) Arithmetic adds 1 + 1 and equals 3
     # No reason given
     # ./rspec.rb:9

  2) Arithmetic adds 1 + 1 and equals 2
     # No reason given
     # ./rspec.rb:12


Finished in 0.00226 seconds (files took 0.44679 seconds to load)
2 examples, 0 failures, 2 pending
```

These examples can also be marked as 'pending' by adding the `pending` flag to the describe block:

```
describe "Arithmetic", pending: true
```

Results in:

```
Arithmetic
  adds 1 + 1 and equals 3 (PENDING: No reason given)
  adds 1 + 1 and equals 2 (FAILED - 1)

Pending: (Failures listed here are expected and do not affect your suite's status)

  1) Arithmetic adds 1 + 1 and equals 3
     # No reason given
     Failure/Error: expect(1 + 1).to eq 3

       expected: 3
            got: 2

       (compared using ==)
     # ./rspec.rb:10:in `block (2 levels) in <top (required)>'

Failures:

  1) Arithmetic adds 1 + 1 and equals 2 FIXED
     Expected pending 'No reason given' to fail. No error was raised.
     # ./rspec.rb:12

Finished in 0.03692 seconds (files took 0.32464 seconds to load)
2 examples, 1 failure, 1 pending

Failed examples:

rspec ./rspec.rb:12 # Arithmetic adds 1 + 1 and equals 2
```

Note the failed example, because Rspec in this case expected the test to fail, but it actually passed.

In this case, we can just mark the individual failing test as pending:

```
it "adds 1 + 1 and equals 3", pending: true
```

Results in:

```
Arithmetic
  adds 1 + 1 and equals 3 (PENDING: No reason given)
  adds 1 + 1 and equals 2

Pending: (Failures listed here are expected and do not affect your suite's status)

  1) Arithmetic adds 1 + 1 and equals 3
     # No reason given
     Failure/Error: expect(1 + 1).to eq 3

       expected: 3
            got: 2

       (compared using ==)
     # ./rspec.rb:10:in `block (2 levels) in <top (required)>'

Finished in 0.0288 seconds (files took 0.40468 seconds to load)
2 examples, 0 failures, 1 pending
```

Finally, instead of passing `true` or `false` to `skip` or `pending` tags, a string explaining the reason for skipping or pending can be provided:

```
describe "Arithmetic", skip: "Blocked by ticket #45"
```

or

```
describe "Arithmetic", pending: "Blocked by ticket #45"
```

Results in:

```
Arithmetic
  adds 1 + 1 and equals 3 (PENDING: Blocked by ticket #45)
  adds 1 + 1 and equals 2 (PENDING: Blocked by ticket #45)
```

