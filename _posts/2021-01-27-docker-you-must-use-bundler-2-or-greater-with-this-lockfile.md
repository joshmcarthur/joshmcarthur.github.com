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

---

**Follow-up**: this works when building the image, but not when using bundle
after that (it reverts to trying to use the old version). I tried a range of
things to get this environment variable to persist, but `export BUNDLER_VERSION`
doesn't persist in the container, and putting the environment variable export in
`~/.bashrc` or `/etc/profile` only gets run when a shell is run - not when a
standalone command (like `bundle exec rails s --binding=0.0.0.0`) is run. I
ended up not being able to find a solution for this in the Dockerfile. Instead,
I added a `docker-entrypoint.sh` script in the root of the project with the
following contents:

``` sh
#!/bin/bash
set -Eeuo pipefail
# Use the version of Bundler specified in Gemfile.lock, not the one packaged
# with the original Docker image
export BUNDLER_VERSION="$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)"
exec $@
```

And declaring this entrypoint in my Dockerfile: `ENTRYPOINT
["docker-entrypoint.sh"]`


This means that when my command is run, it will be passed to the entrypoint -
e.g. `docker-entrypoint.sh bundle exec rails s --binding=0.0.0.0`, and will have
the `BUNDLER_VERSION` environment variable `export`d from within that script.