---
layout: post
title: "My favourite HTTP client"
description: "A pattern I consistently use to create Ruby HTTP API clients"
category: TIL
tags: [til,technology,rails,ruby]
---

It's 2019. I'm writing code that needs to communicate with other APIs _all the time_. The code I post below reflects a snapshot of my current template API client. 
If I need to commuicate with a third-party in Ruby, I'm using this class.

``` ruby
require "ostruct"

class MyApiClient
  class Error < StandardError; end

  def initialize(configuration=nil, stubs=nil)
    @configuration = configuration || Rails.application.config_for(:my_api)
    @connection = Faraday.new(url: @configuration[:host], headers: headers) do |conn|
      conn.request  :json
      conn.response :json, parser_options: { object_class: OpenStruct }
      conn.response :raise_error
      conn.response :logger, Rails.logger, bodies: true if @configuration[:debug]

      stubs ? conn.adapter(:test, stubs) : conn.adapter(Faraday.default_adapter)
    end
  end

  %i[get post patch put delete].each do |verb|
    define_method(:"raw_#{verb}") do |*args|
      @connection.public_send(verb, *args)
    rescue Faraday::Error
      raise Error
    end

    define_method(verb) do |*args|
      public_send("raw_#{verb}", *args).body
    end
  end

  def headers
    { user_agent: user_agent } # ... other default headers here
  end

  def user_agent
    @configuration.fetch(:user_agent, "My Application #{Rails.application.config.version}")
  end
end
```

Let's deconstruct this.

1. We require "ostruct" to get the `OpenStruct` class.
   [`OpenStruct`](https://ruby-doc.org/stdlib-2.5.1/libdoc/ostruct/rdoc/OpenStruct.html)
   is a handy little class in the Ruby standard library that accepts a hash, and
   allows attributes to be accessed either via hash keys (`my_object[:attribute]`),
   or via method calls (`my_object.attribute`). 
2. Make the class `MyApiClient`. Note we're not subclassing anything here. This class
   uses a bit of stuff from Rails, but it's all optional. 
3. Define our own error class, a subclass of
   [`StandardError`](https://ruby-doc.org/core-2.5.0/StandardError.html). We'll use
   this class further down to wrap all exceptions coming from our HTTP library.
   Wrapping exceptions is beneficial since it allows consumers of this API client to
   not need to know too much about how the request is being made - just that
   something went wrong. If something goes wrong here, a `MyApiClient::Error` will be
   raised. The consumer can handle this with an error message or retry and/or inspect
   the `cause` attribute of the error to access the specific error from the library
   if more context is required.
4. Start our `initialize` method. This method accepts two arguments - `configuration`
   and `stubs`. We'll get into what these do in the next couple of points.
5. Set up `@configuration`. This defaults to whatever is passed in - the API client
   just expects something that has hash-style accessors - so a `Hash` would do the
   job here, but also an `ActiveRecord` model, an `OpenStruct`, or anything else that
   implements `[](key)`. If nothing is passed in, we fall back to getting Rails to
   fetch our configuration using `config_for`. I have [blogged before about
   `config_for`](https://www.joshmcarthur.com/til/2018/03/07/rails-config_for.html),
   so won't go into detail - basically Rails looks for a YAML file in `config/YOUR
   KEY.yml` - so `config/my_api.yml` in this case, parses it to a Hash, and then
   grabs whatever values are under the key named by `Rails.environment` - so
   `development`, `test`, `production` etc. It'll also run this file through ERB when
   it reads it, so you can reference environment variables or any other config
   service using `<%= %>` tags.
6. Set up the base HTTP connection. This is an HTTP API _client_, not an HTTP API
   _library_, so we want to lean on others' hard work here. You can actually use any
   HTTP library you'd like here - as you'll see further down, all that our class really needs of `@connection` are methods representing the HTTP verbs - `get`, `post`, etc. Some libraries even just have a `request(verb, ...args)` method you could use instead. It really doesn't matter too much as long as your helper methods we're about to define know what to expect back from whatever library you're using. In this case, I'm using the [Faraday gem](https://github.com/lostisland/faraday), with [middleware](https://github.com/lostisland/faraday_middleware). The set up I have with Faraday is useful, but not super specific to this client class, so I've talked more about it in the [Faraday](#faraday) section below.
7. Next we define some methods - two methods for each HTTP verb. The first method is
   named `raw_#{verb}` - `raw_get`, `raw_post`, and so on. The purpose of this
   method is to take arguments for a request that the HTTP library is expecting, and
   make a request. It should return the raw response object that the library returns.
   In this method, we rescue errors bubbling up from our HTTP library - in this case,
   `Faraday::Error`, and re-raise our own error. Calling `raise` inside a `rescue`
   block with a new exception class like this will automatically assign the original
   error to the `cause` attribute of the re-raised error. The second method we define
   is just named after the verb - `get`, `post`, etc. This method is intended as a
   friendlier version of the `raw_request` method, and the idea behind this one is to
   provide a shortcut to just getting the response body data - 99% of the time, this
   is what you want, and so long as your HTTP library can raise errors when it runs
   into bad HTTP status codes (e.g. 400..600), you don't need to worry about checking
   the response status - just handling any errors. For the HTTP library used here,
   `faraday`, we have the `raise_error` middleware making sure that errors are raised
   when something goes wrong, and the `json` response parser that will turn our
   response body into an object. 
8. We're nearly done - just a couple of configuration methods to go. `headers` should
   return the default headers to be applied to _all_ requests. In this case, we just
   add a `User-Agent` header. It's courtesy when consuming an API to make sure that
   your requests are identifiable, and the `User-Agent` header is perfect for this.
   You can put any other headers you'd like here in, such as `Authorization`,
   `X-Api_Key`, etc.
9. The `user_agent` method just builds a UA string for us to use - here, we're using
   the common name of our application, and the version of our application. This will
   return something like "My Application abc123", which allows both the name and
   release of our application to be identified, and if necessary filtered or rate
   limited. Without adding a user-agent, the HTTP library will usually use it's own
   name as the user agent string, which means that all of your requests will be
   indistingushable from all the other "faraday", "HTTParty", "curl", "wget", etc.
   requests that others are making.

And that's it! Testing is also pretty simple. I usually prefer integration testing
something like this by mocking an HTTP request/response - usually the HTTP library
will support something like this. You can also test your dynamic method definitions
by calling them and asserting that the same method with expected args is called on
the `@connection`, with the default headers mixed in. 

## Faraday

You'll notice above that Faraday makes up a fair amount of the meat of functionality
of this class. I wanted to break it into it's own section because, as I mentioned
above, it doesn't really matter what HTTP library is used, so long as it can be
passed data to make a request with, and passes some kind of response object back.
Examples of other HTTP libraries you might consider instead of Faraday are:

* `excon` - a bit more bare metal, but a much smaller dependency - this would be
  suitable if you had a moderately complex HTTP endpoint to communicate with from a
  gem where you maybe didn't want to have a dependency as large as Faraday.
* `HTTParty` - quite a flexible library but sometimes a bit _too_ abstract for my
  liking. It also has an annoying post-install message whenever `bundle install` is
  run - including if it's depended on by another gem. The README for HTTParty has
  it's own example of how to make a super-slim API client class, so if you're looking
  for something specific to HTTParty, be sure to check that out.
* `Net::HTTP`. Oh-so-tempting since it's part of the Ruby standard library, but it
  really is a low-level API. `Net::HTTP` may be worth considering if you are the
  author of a gem and don't want to add extra dependencies, but otherwise it's
  probably best to use a library to avoid code that is perhaps more verbose than it
  needs to be.

Faraday is modelled on [rack](https://rack.github.io/), which is the de-facto
interface between HTTP requests/responses, and your Ruby server. You could think of
Faraday as the 'frontend' version of Rack. 

It has a similar system of almost immediately bundling the request/response into an
'env' (environment) object, and then fulfilling the request and transforming the
response by applying a middleware pipeline to it. 

The actual out-of-the-box behaviour of Faraday is quite capable of making an HTTP or
HTTPS request, complete with params, headers, and all of the other stuff that makes
up the core of HTTP. To really unlock some neat behaviour though, it's worth checking
out the middleware that can be applied to your Faraday connection object. Middleware
have been split out of the main Faraday project, so you only need to have that extra
gem dependency if you need it. The gem is called
[`faraday_middleware`](https://github.com/lostisland/faraday_middleware). 

The middleware I use in my API client is relatively small. I'll step through each one
and describe what I use it for/what it does:

* `conn.request :json` - tells
  [FaradayMiddleware::EncodeJson](https://github.com/lostisland/faraday_middleware/blob/be685418ba8ef4c428f726e7b943b2fb64860ec5/lib/faraday_middleware/request/encode_json.rb)
  to automatically transform any params or request body I pass in to JSON. This means
  that I can pass in a whole big hash (or in fact anything that responds to
  `to_json`), and Faraday will automatically transform it into JSON before sending
  the request.
* `conn.response :json, parser_options: { object_class: OpenStruct }` - tells Faraday
  to automatically transform the response body from a string, back into JSON
  (obviously this requires the response actually be valid JSON!). I am passing some
  special `parser_options` here to tell JSON to decode using `OpenStruct` as the
  object class. Normally, `JSON.parse` will return a Hash, which is _fine_, but means
  that all the attributes need to be accessed using `[]` with String keys. Using
  `OpenStruct` as the object class means that (as I mentioned above), attributes can
  be accessed using hash-key lookup syntax, or method syntax. I've also written a
  blog post that describes this technique with a few examples at
  https://www.joshmcarthur.com/til/2018/12/03/ruby-deserialize-json-to-an-openstruct.html. 
* `conn.response :raise_error` - this middleware is actually [part of the main Faraday
  project](https://github.com/lostisland/faraday/blob/master/lib/faraday/response/raise_error.rb), so you don't need the middleware gem for this one. It inspects the HTTP status code returned in the request, and will raise a variant of `Faraday::Error` if the request did not succeed. These variants can be specific for common statuses, like `Faraday::BadRequestError` or `Faraday::ResourceNotFound`, or a bit more generic, like `Faraday::ClientError` and `Faraday::ServerError`. The rresponse status, headers, and body are attached to the error for later inspection. In the API client, we're using this middleware to make sure that `Faraday::Errors` are raised when a HTTP request fails - we're then rescuing the error, wrapping it in our own error class, and re-raising it.
* `conn.response :logger, Rails.logger, bodies: true if @configuration[:debug]`. By
  default, Faraday won't really log much that is useful. This is by design, since
  logging a full request/response takes up a number of log lines. This middleware is
  conditionally added to the connection if the configuration we pass in (which,
  remember, can either come from a hash passed to the API client, or by included in
  our `config/api_client.yml` as `debug: true`) includes a `:debug` key that is
  truthy. If `debug` mode is set, we direct the Faraday logging middleware at our
  Rails.logger (you could direct it to it's own log file or any other `Logger` if you
  wanted to, but `Rails.logger` means that all our app logs go into a single stream),
  and also tell it to log the request body with the `bodies: true` option. Without
  this option, Faraday will only log the request URL and some minimal response info,
  which isn't as useful for debugging as seeing the full request/response.
* `conn.adapter` - set either to `:test`, or `Faraday.default_adapter`. This setting
  is conditional on whether `stubs` have been passed in to the API client. If they
  have, we assume that we're testing the API, so we tell Faraday to use a fake
  adapter named 'test'. This adapter will look up a request in the `stubs` object
  when the client is called, and if a stub exists that matches the request (matching
  on path and/or params and/or headers), it will return the stubbed response. If
  stubs have not been passed in, we're operating in 'real' mode, and set the adapter
  to `Faraday.default_adapter`. This defaults to `net/http`, but there's all sorts of
  adapters you can use instead. 

  For more information on testing and using adapters with Faraday, you'll find both the [testing
  guide](https://github.com/lostisland/faraday/blob/993a483ec34d8d2c6005dbd0623ed41ba5029662/docs/adapters/testing.md)
  and the [adapters
  guide](https://github.com/lostisland/faraday/blob/993a483ec34d8d2c6005dbd0623ed41ba5029662/docs/adapters/index.md)
  useful.

  ---

  That's it. Hopefully this has been a useful and interesting deep dive into a nice
  understandable and configurable HTTP API client. If you've spotted any mistakes or
  points that need clarifying, please feel free to [contribute a patch](https://github.com/joshmcarthur/joshmcarthur.github.com/pulls) to my
  website repo!
