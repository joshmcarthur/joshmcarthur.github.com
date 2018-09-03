---
layout: post
title: "Test CORS headers with Rails in development"
description: "Standards-compliant browsers do not send CORS requests to the same origin, so testing out headers needs an additional step."
category: TIL
tags: [til,rails]
---

When testing CORS headers in Rails, an additional step is needed to check that the headers are working correctly.
This is because of a behaviour in Chrome specifically, where requests that are to the same origin do not perform
CORS validation - so it's very difficult to tell whether CORS is working correctly or not. Chrome does not even appear
to send the 'Origin' header for same-origin requests, meaning that CORS headers never show up in the response.

The way I found of testing this is to start an additional Rails server in development, and then set this as your asset
host. Using the asset host setting means that Rails will prefix URLS to your images, stylesheets, javascripts and other
assets with the asset host, rather than the current request host. Since the host and port are different, this is 
considered a different origin, and so triggers normal CORS behaviour.

Configure asset host:

``` ruby
# config/environments/development.rb
Rails.application.configure do
  # ...
  config.asset_host = "http://localhost:3001"
  # ...
end
```

Starting the first Rails server:

``` bash
bundle exec rails s 
```

Starting the second Rails server:

``` bash
bundle exec rails s -p3001 --pid=tmp/pids/server1.pid
```

Then visit http://localhost:3000. If you inspect the network requests, you should see some CORS warnings 
(unless you already have CORS configured correctly of course!). 
