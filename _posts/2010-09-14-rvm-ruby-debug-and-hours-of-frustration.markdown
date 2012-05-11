---
title: RVM, Ruby-Debug, and hours of frustration
layout: post
tags:
  - rails
  - rvm
  - ruby-debug
  - linecache

type: regular
comments: true
---

Every now and then, you run into one of THOSE problems - inexplicable, and
something it seems no one else has solved before you. This afternoon, I hit one
of these. Basically, I had just installed RVM, Ruby_1.8.7 and Rails_2.3.8 -
everything was working great - I could run a server just fine, and use the
running site.
Eventually though, I found something broken. Easy enough to diagnose, I thought
- I'll just start up a debugging server, and work out whats going on.
Wrong. Wrong, wrong, wrong.
What followed was a continuation of this error:
You need to install ruby-debug to run the server in debugging mode.
So I had a Google - lots of people have run into this problem before (here and
here specifically) - the problem is, most of these problems came down to a
missing library called libreadline - for them, installing the library corrected
all of their problems.
In the end, I stumbled across this_post, from a guy having issues with Ruby
after upgrading his Mac OS X - finally - he suggested something I hadn't
already tried.
And, as it turns out - it worked! I have no idea why - but there we go.
If you are having a problem getting Ruby 1.8.7 to acknowledge ruby-debug is
there when running a debugging server, try this:
gem uninstall ruby-debug gem install ruby-debug linecache --no-ri --no-rdoc
script/server --debugger
... It might just work for you!

