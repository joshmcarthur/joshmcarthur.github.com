---
layout: post
title: "Access browser console messages from a Capybara test"
description: "Describes using the current Capybara driver to access console.log, console.error, etc from a Capybara test."
category: TIL
tags: [til,testing,rails,capybara]
---

A very handy API I've stumbled across today:

``` ruby
page.driver.browser.manage.logs.get(:browser)
```

This returns an array of [Selenium::LogEntry](https://github.com/SeleniumHQ/selenium/blob/93c9ec77403f1c379a8f38d7b499f4f483b40943/rb/lib/selenium/webdriver/common/log_entry.rb) instances which have the expected properties - `level`, `timestamp`, and `message`. You can use standard Enumerable methods to filter the log entries down to the information relevant to you.

For example, all error messages:

``` ruby
page.driver.browser.manage.logs.get(:browser).select { |le| le.level == "SEVERE" }.map(&:message)
=> ["http://127.0.0.1:40539/madeup - Failed to load resource: net::ERR_CONNECTION_REFUSED", ...]
```
