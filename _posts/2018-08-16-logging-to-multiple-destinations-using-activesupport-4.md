---
layout: post
title: "Logging to multiple destinations using ActiveSupport 4+"
description: "This post describes how a method in ActiveSupport 4+ can be used to log to two or more destinations at once."
category: TIL
tags: [til,technology,rails]
---

Logging to multiple destinations is something I seem to have to do _all the time_, and until now,
I've never really been able to find an approach I'm happy with. Almost always, I'm writing some kind
of developer-script, and I want to write messages to both the terminal (to let the dev know what is
going on), and to a log file (for future reference/audit). I don't _normally_ want to use
`Rails.logger` for this - I prefer to have a brand new logger specifically for my output. Having
said that, I have verified that the approach described in this post does work with a standard Rails
logger (defined in `Rails.logger` or `config.logger` depending on where you're trying to work with
it). 

> This approach relies on a method added to ActiveSupport version ~> 4.0. Versions of ActiveSupport
> map directly to Rails versions (ActiveSupport is part of the [`rails/rails` repository after
> all](https://github.com/rails/rails/tree/master/activesupport)), so Rails 4+ will also work here.

When working with logging in Ruby, the
[`Logger`](https://ruby-doc.org/stdlib-2.5.1/libdoc/logger/rdoc/Logger.html) class is normally the
one is used. This is completely reasonable, as it's part of the standard library, and is almost
always sufficient. For those scenarios where something more is needed, `ActiveSupport::Logger` is
available. The API for ActiveSupport's Logger is broadly the same as Ruby's Logger, with a few
bonuses, such as [tagged
logging](https://api.rubyonrails.org/classes/ActiveSupport/TaggedLogging.html#method-i-tagged) and
_the ability to extend loggers with other loggers_!

Extending any logger is possible using the `extend` and `broadcast` method available on
`ActiveSupport::Logger`. Unfortunately, I can't link to documentation for either of these methods,
as they don't seem to be documented. 

Here's an example not using any Rails stuff, just ActiveSupport, as an example:


``` ruby
require "active_support/logger"
console_logger = ActiveSupport::Logger.new(STDOUT)
file_logger = ActiveSupport::Logger.new("my_log.log")
combined_logger = console_logger.extend(ActiveSupport::Logger.broadcast(file_logger))

combined_logger.debug "Debug level"
combined_logger.info "Info level"
combined_logger.error "Error level"
```

With the console output being:

``` 
Debug level
Info level
Error level
```

And `mylog.log` containing:

```
# Logfile created on 2018-08-16 15:24:10 +1200 by logger.rb/61378
Debug level
Info level
Error level
```

Usage in Rails really isn't that different, the only difference is that you will already have a 
logger set up to log _somewhere_ defined in `Rails.logger` (or `config.logger` if you are modifying
a config file). You can just go ahead and extend that logger to add another logging destination:

``` ruby
# NOTE: The actual config file doesn't really matter here.
# config/application.rb
extra_logger = ActiveSupport::Logger.new("extra.log")
config.logger.extend(ActiveSupport::Logger.broadcast(extra_logger))
```

Multiple logging is a handy trick to keep in mind, as there's a few places it can come in handy. As
mentioned at the start of this post, my usual use case is to log to a file and STDOUT at the same
time, but there's all sorts of times you might want to post a log message multiple places. Maybe you
want logs to go to a third party service, as well as local log file, as well as STDOUT for good
measure? Sure!


