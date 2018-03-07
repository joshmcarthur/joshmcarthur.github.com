---
layout: post
title: "Pattern for configuring integration objects"
description: "TIL: A useful and repeatable pattern for configuring objects"
category: til
tags: [til,rails,tech]
---

I often struggle with the correct way to set any kind of configuration on a class, especially when it is a class intended to integrate with an external API that usually needs several configuration values.

I initially implemented my own configuration pattern, before coming across [this great pattern](https://robots.thoughtbot.com/mygem-configure-block) by ThoughtBot that has been used for their open-source library Clearance:

``` ruby
class MyApiIntegration 
  class << self
    attr_accessor :configuration
  end

  def self.configure
    self.configuration ||= Configuration.new
    yield(configuration)
  end

  class Configuration 
    attr_accessor :api_key, :api_secret
  end
end
```

This exposes a very simple API for configuring the object:

``` ruby
MyApiIntegration.configure do |config|
  config.api_key = "wow"
  config.api_secret = "api"
end
```

I found the `attr_accessor` on `class << self` particularly useful, as I had been running into issues with `class_attribute`, class-level variables, and `cattr_accessor` where I was losing configuration between test runs. The only issue I have with this code snippet is that the default configuration (if any) is not assigned until `configure` is called. I am going to experiment with this pattern in my investment time to try and identify a way of having the default configuration used if `configure` does not need to be called.

Thanks ThoughtBot!