---
layout: post
title: "Rails: config_for"
description: ""
category: TIL
tags: [til,rails,tech]
---

Sometimes an application can have pretty complex configuration for certain components.
There's always temptation to put these settings straight in your service, but today I learned about a simple method built into Rails from 4.2 onwards that lets this config live outside of your Ruby classses: [`Rails.application.config_for`](https://apidock.com/rails/Rails/Application/config_for).

This method allows you to place your config in an environment-namespaced YAML file within your `config/` folder, just like `database.yml` or `secrets.yml`. Here's an example of a config file I created for Shopify:

``` yaml
# config/shopify.yml
development:
  shop_name: 'mystore-development'
  api_key: 'abc123'
  password: 'secret!'
test:
  shop_name: 'mystore-test'
  api_key: 'abc245'
  password: 'secret!'
production:
  shop_name: <%= ENV['SHOPIFY_SHOP_NAME'] %>
  api_key: <%= ENV['SHOPIFY_API_KEY'] %>
  password: <%= ENV['SHOPIFY_PASSWORD'] %>
```

It can then be accessed within an initializer or even your service object:

``` ruby
ShopifyService.configuration = Rails.application.config_for(:shopify)
```

With the example above, this would return a hash:

``` ruby
{ 
  shop_name: "mystore-development",
  api_key: "abc123",
  password: "secret!"
}
```