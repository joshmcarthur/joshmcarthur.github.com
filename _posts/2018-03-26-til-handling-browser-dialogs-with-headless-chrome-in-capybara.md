---
layout: post
title: "TIL: Handling browser dialogs with headless Chrome in Capybara"
description: "TIL: How to interact with browser dialogs using Selenium Webdriver with Headless Chrome"
category: 
tags: [til,technology,rails]
---

My normal Rails 5.x [development stack](https://github.com/joshmcarthur/Dockerfiles/blob/b3a5ec49505b76a89257aa458b196266f9926935/rails/Dockerfile#L11) now uses Chrome, running headlessly, powered by the following gems:

``` ruby
# Gemfile
# ...
gem 'capybara'
gem 'chromedriver-helper'
gem 'capybara-selenium'
```

Unlike using things like Poltergeist, the only external dependency you need to run these tests is Chrome itself. If you wish to reduce your gem dependencies, you can also remove `chromedriver-helper`, but this will require that you get [chromedriver](https://sites.google.com/a/chromium.org/chromedriver/) set up.

One of the behaviours I've recently wanted to test is interactions with browser dialogs. This is particularly common when using Rails' UJS helpers, such as:

``` erb
<%= link_to "Cancel", "#", data: { confirm: "Are you sure?" } %>
```

And straight Javascript such as:

``` javascript
var projectName = "my-project"
var shouldCancel = (prompt("Enter your project name to cancel") === projectName);
```

Interacting with these kinds of browser interfaces can be hard from an abstraction such as Capybara. In fact, because each browser can present these dialogs slightly differently, the method used depends on the browser. The rest of this post assumes you're using Chrome as your driver, but if you're just after a summary, I found [this Gist](https://gist.github.com/mikepack/5207962) to be super useful.

### Accepting a prompt - i.e. prompt("Are you sure?");

``` ruby
confirm = page.driver.switch_to.alert
assert_equal confirm.text, "Are you sure?
confirm.accept # You can also `confirm.dismiss` if you want to test the negative path
```

### Dismissing a messge - i.e. alert("Reset password instructions have been delivered.");

``` ruby
alert = page.driver.switch_to.alert
assert_equal alert.text, "Reset password instructions have been delivered."
alert.accept
```

### Inputting data to a prompt - i.e. prompt("Enter your project name to cancel")

``` ruby
prompt = page.driver.switch_to.alert
assert_equal prompt.text, "Enter your project name to cancel"
prompt.send_keys "my-project"
prompt.accept
```

