---
layout: post
title: "Overriding Action Caches"
date: 2011-09-30 11:48
comments: true
categories: howto
tags: 
  - howto
  - development
  - rubyonrails
  - caching
  - optimization
---

Recently, I have been working on a web application that is quite media rich, and is expected to run into quite a bit of traffic. I've been working on building an API for a front end system, using JSON to handle passing this data back and forth.

Obviously with this amount of traffic, and the size of some of the JSON collections we were having to marshall and store via Rails, we were going to need some pretty intense caching to reduce the load on Rails, and our database server. We had to balance this need, however, with the requirement that data should be live, or close to live (i.e. around 5-10 minutes) - in particular, statistics, which are calculated on-demand for several responses.

The strategy we chose to manage this balance was to use Rails' provided `caches_action` method to cache our JSON responses, building up a cache key from certain parameters, as well as some meta-data, for example, the user's logged-in status. Because we were using memcached, we could use the `:expires_in` option to tell the memcached store to expire the cached value after x minutes.

This approach worked for a while, but we found we had a pretty major problem - while the data was cached, it went alright, but as soon as the cache expired we were having loads of users hitting a response that took way to long to build (before we optimized queries, 30+ seconds). So, we needed another fix.

To fix this problem, we tried out adding some cron tasks that used curl to ping the cached URLs, to try and preload the cache so that less users would be hitting the DB. This only partially fixed the problem though, so we identified a solution that would work a little better for us.

What we wanted to do was to leave our existing caching in place - aside from the expiry, it was working fine, and we didn't want to rework everything. With this in mind though, we needed a way to force a refresh of the data in the cache external from the controller. What we ended up implementing was a monkeypatch on Rails' caches_action-related methods, that allows us to pass in an `:overwrite` option - this can be a Proc, or just a boolean - basically, when the value of `:overwrite` is true, Rails will bypass the cached value, grab the _new value_, and load this into the cache - effectively refreshing the value without a user having to trigger the process. 

Here's the monkeypatch code - have a scan through it, and I'll explain it below:

``` ruby
    require 'set'

    module ActionController #:nodoc:
      module Caching

	    module Actions
        extend ActiveSupport::Concern
      
          protected
          class ActionCacheFilter #:nodoc:
            def initialize(options, &block)
              @cache_path, @store_options, @cache_layout =
                options.values_at(:cache_path, :store_options, :layout)
            end

            def filter(controller)
              path_options = if @cache_path.respond_to?(:call)
                controller.instance_exec(controller, &@cache_path)
              else
                @cache_path
              end

              cache_path = ActionCachePath.new(controller, path_options || {})
              overwrite = if @overwrite = @store_options.fetch(:overwrite, nil)
                @overwrite.respond_to?(:call) ? controller.instance_exec(controller, &@overwrite) : @overwrite
              else
                false
              end

              body = overwrite ? nil : controller.read_fragment(cache_path.path, @store_options)

              unless body
                controller.action_has_layout = false unless @cache_layout
                yield
                controller.action_has_layout = true
                body = controller._save_fragment(cache_path.path, @store_options)
              end

              body = controller.render_to_string(:text => body, :layout => true) unless @cache_layout
              controller.response_body = body
              controller.content_type = Mime[cache_path.extension || :html]
            end
          end
        end
      end
    end
```

By dropping this code into `config/initializers`, this code gets patched into the ActionController::Caching::Actions::ActionCacheFilter class, and overrides the `initalize` and `filter` methods to let us a) pass in an override option, and b) choose to refresh the cache if the override option is set.

The filter method performs as normal until it has finished generating the cache path - at this point, it would normally return the cached response if it was there, and if it had not expired. Instead, my colleague [James Moriaty](http://telos.co.nz) replaced some code here:

* First, it retrieves the value of the `:overwrite` option passed in to the `caches_action` method from the `@store_options` hash - if it's a Proc, it executes it here to get the value, otherwise assumes it's a boolean variable.
* If the `:overwrite` option has not been passed in, it returns false - i.e. don't overwrite the cache.
* If the overwrite value is true, it sets the body to nil, so that it will be re-built. Otherwise, it does the usual and returns the cached response from Memcache.
* From here, it more or less goes back to the default class, rebuilding the response from the database.

In our application's case, we use this functionality by tweaking our cron jobs a little to pass in a particular parameter - we then added the `:overwrite` option to our `caches_action` methods, with a Proc that returns true if this parameter equals the correct value. 

So far, this solution has worked fantastically - now, hardly any of our users hit the database - instead, they are heading to memcache to grab that response, while our background cron jobs rebuild the data that will get returned to them. Using a parameter for refreshing the cache also lets us easily refresh manually for testing or to check for a value. 

This solution is clean, simple and easy to implement. I suggest that if you are facing similar problems, that you give it a go - it's really adaptable, and requires few changes if you are already using action caching. Full credit to James for thinking up and implementing this solution - I'm just documenting it.
