---
layout: post
title: "CLI tool entr for running a command when a file changes"
description: "A nice simple tool for watching files for changes"
category: TIL
tags: [til,technology]
---

[`entr`](http://eradman.com/entrproject/) is a tool I've been using a bunch recently - mostly for watching source files, and running tests when I change the source file. `entr` can be piped one or more files, which means it's really easy to use - just use `ls`, `find`, or any other tool that outputs filenames, and then pipe it to entr:

```
ls app/models/widget.rb | entr bundle exec rspec spec/models/widget_spec.rb
```

```
ls app/models/widget.rb app/presenters/widget_presenter.rb | entr bundle exec rspec spec/system/widgets/list_spec.rb
```

```
find . -name "*.rb" | entr rubocop
```

`entr` also has a handy shortcut, `/_` to use a placeholder if you're just watching a single file which cuts down on typing:

```
ls app/models/widget.rb | entr bundle exec rspec /_
```

There are plenty more options to check out in the [`entr` man page](http://eradman.com/entrproject/entr.1.html)

`entr` is available in Linux distros via `yum`, `apt`, etc. On Mac OS, it's available in Homebrew: `brew install entr`.
