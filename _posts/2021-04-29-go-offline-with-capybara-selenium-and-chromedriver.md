---
layout: post
title: "Go offline with Capybara, Selenium and Chromedriver"
description: "How to adjust network connectivity status of Chrome via Capybara, Selenium and Chromedriver"
category: TIL
tags: [til,testing,ruby]
---

> There's some preamble here. [Jump to solution](#solution)

Recently, I've been working on a client project that needs to function offline. This means that I have a subset of tests where I need to change the connectivity status of the browser driving the tests to simulate being offline to make assertions that the application is behaving correctly.

I already knew that the devtools had the capability to simulate either being completely offline, or to impose latency and throughput on the connection to simulate poor connectivity and/or older connection standards like 2G.

Because of this, I _suspected_ that there would be an API to change the network connection status, I just had to track it down. After a bit of a journey through Selenium's different layers (and languages - often I'm stumble across what I'm looking for in a different language binding for Selenium like .NET or Python, and then have to go and find the equivalent bit of code in Ruby), I found the solution:

``` ruby
#
# Sets network conditions
#
# @param [Hash] conditions
# @option conditions [Integer] :latency
# @option conditions [Integer] :throughput
# @option conditions [Boolean] :offline
#

def network_conditions=(conditions)
  @bridge.network_conditions = conditions
end
```

&mdash; [Source](https://github.com/SeleniumHQ/selenium/blob/6c701582f1724bd9d33a9017cb4189eb4e4053c9/rb/lib/selenium/webdriver/common/driver_extensions/has_network_conditions.rb#L23)

This method calls the setter on `@bridge`, which invokes the command through chromedriver to actually set the conditions:

``` ruby
# File 'selenium/webdriver/chrome/bridge.rb', line 45

def network_conditions=(conditions)
  execute :set_network_conditions, {}, {network_conditions: conditions}
end
```

This method is defined as an 'extension' (basically, a module) on the Capybara page's driver's `browser` (this is essentially a pointer to the running browser application). It functions as a setter method in Ruby, so we can just pass a hash to set the variables we want. It's worth pointing out that I **did** have to provide all of these hash keys - it doesn't appear to be possible to provide just one.

<span id="solution" />

Here's how I set my test browser to offline:

``` ruby
page.driver.browser.network_conditions = { offline: true, latency: 0, throughput: 0 }
```

And online again:

``` ruby
page.driver.browser.network_conditions = { offline: false, latency: 0, throughput: 0 }
```

You could also adjust latency and throughput if you wished, so while the application was _technically_ online, it perhaps had very high latecy and very low throughput. This would be useful for testing some kind of 'slow network connection' message, for example.





