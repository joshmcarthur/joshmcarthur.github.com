---
layout: post
title: "Simple Ruby API clients with HTTParty"
description: "Creating a consistent API to interact with a third party is important. HTTParty is great for this."
category: TIL
tags: [til,technology,rails]
---

I frequently write code that interacts with a third-party HTTP API. When I create this code, I find the best approach is to create a very thin abstraction layer over the API that can easily be stubbed out under test. If the data returned from the API is complex or requires further processing, I occasionally provide additional abstraction layers on top of the HTTP client, but frequently, just having a consistent API client is enough. 

In terms of creating this client, there are many, many options in Ruby, ranging from a relatively complicated approach by using the Ruby standard library `net/http` module, up to a series of gems that either abstract this API or provide another HTTP interface altogether. An example of a gem that abstracts across the HTTP driver, and the one I'm going to be discussing today is [`httparty`](https://github.com/jnunemaker/httparty). 

Despite having a [stupid post-install message that can't (easily) be turned off](https://github.com/jnunemaker/httparty/blob/6888e5343aaac2dab3aac1afa05615cdec9587f5/httparty.gemspec#L21), HTTParty provides a very easy way of defining an API client. 

Here's an example of an API client I put together recently:

``` ruby
require "httparty"

class MyAwesomeAPI
  include HTTParty
  format :json

  def initialize(username, api_key)
    @auth = { username: username, password: api_key }
    self.class.base_uri("https://api.myawesomeapi.com")
  end

  def get(path, options = {})
    options = default_request_options.merge(options)
    self.class.get(path, options)
  end

  private

  def default_request_options
    { 
      headers: { "Accept" => "application/vnd.myawesomeapi.v3+json" }, 
      basic_auth: @auth 
    }
  end
end
```

This API client:

1. Will automatically serialize and deserialize requests using JSON encoding
2. Defines the base URI in a single place
3. Adds basic authentication to the request
4. Adds an outgoing header to each request defining the mimetype of content it will accept - in this case, a versioned custom type. 

In the case of this API, I only required `GET` access to resources, so that's all I've defined. It's entirely possible to implement other HTTP methods in a very similar manner, or even to provide further abstractions, such as methods named after the API endpoint in question. As an example, if this API allowed for a listing of "widgets", an `all_widgets` method could be defined that returned an array of `Widget` instances created from the JSON response.

HTTParty has [many options](https://www.rubydoc.info/github/jnunemaker/httparty/HTTParty/ClassMethods) for customizing how the request and response will be handled, but at the end of the day, what it provides most of all is a simple, abstract, class that allows for an API interface to be quickly defined that will Just Work.