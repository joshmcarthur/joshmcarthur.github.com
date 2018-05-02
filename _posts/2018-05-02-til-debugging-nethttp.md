---
layout: post
title: "TIL: Debugging Net::HTTP"
description: "Net::HTTP can be difficult to debug if it's used deep in a library. I found a handy snipppet to enable logging."
category: TIL
tags: [til, technology,ruby,rails]
---

Today I had to debug a [library](https://github.com/ambethia/recaptcha) to try and determine why a particular HTTP request was failing. The problem was, this particular library uses Net::HTTP, without [any particular hooks](https://github.com/ambethia/recaptcha/blob/7ed15d060186c1465948aa2f17f338ba001027d8/lib/recaptcha.rb#L62) to customise how the request will be executed.

I discovered the following handy code snippet at [https://gist.github.com/ahoward/736721](https://gist.github.com/ahoward/736721), which forces debug output to be on for any instance of Net::HTTP created. This snippet can be pasted into an initializer or even an IRB/pry debugging session to enable debug logging of Net::HTTP to STDERR:

```ruby
BEGIN {

  require 'net/http'

  Net::HTTP.module_eval do
    alias_method '__initialize__', 'initialize'

    def initialize(*args,&block)
      __initialize__(*args, &block)
    ensure
      @debug_output = $stderr ### if ENV['HTTP_DEBUG']
    end
  end

}
```

I _wouldn't_ recommend this code for any deployed environment, since it's monkeypatching a pretty core Ruby class. It's a great debugging tool though, if you're not too sure how to get to a particular HTTP request.
