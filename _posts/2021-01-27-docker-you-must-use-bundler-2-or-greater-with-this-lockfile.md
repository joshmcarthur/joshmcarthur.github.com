---
layout: post
title: "Docker: You must use Bundler 2 or greater with this lockfile"
description: "How to get a Ruby Docker image to respect the version of Bundler being installed in a Dockerfile"
category: TIL
tags: [til,technology,ruby,rails,docker]
---

Ever seen the error "You must use Bundler 2 or greater with this lockfile."
trying to build a Docker image from a Dockerfile that uses an older Ruby
version? Even though you are `gem install`ing the correct version of Bundler?

It turns out that the  Ruby Docker images set an environment variable called
`BUNDLER_VERSION`, which Bundler will always try to use to install dependencies
when you run `bundle install`, even if a newer version has been installed. Even
if you uninstall the old version, it will still not use the newer version. The
solution is to prefix your `RUN bundle install` instruction with `unset
BUNDLER_VERSION`. The full command that I am using to install the version of
Bundler my Gemfile.lock was bundled with and then install my dependencies is:

``` ruby
RUN unset BUNDLER_VERSION &&\
    gem install bundler -v "$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n
    1)" &&\
    echo $(bundle --version) &&\
    bundle install
```

Note: I know that this affects the `ruby:2.5` image (old, I know). While the
problem might not cause an error in newer versions, the _behaviour_ is the same
- `BUNDLER_VERSION` is set, and the version specified by this environment
variable will be used in preference to any other installed version. For this
reason, it's worth checking this, even on newer Ruby images, since dependencies
may be installed with a different version of Bundler than you were expecting.
