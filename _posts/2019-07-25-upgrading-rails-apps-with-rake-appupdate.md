---
layout: post
title: "Upgrading Rails apps with rake app:update"
description: "Rails actually comes with a tool that allows (careful) upgrading of application configuration."
category: TIL
tags: [til,technology,rails]
---

It's been awhile since I've done a Rails update. After this long working with the framework, 
I've learned that it's much, much easier to keep things up to date with tools like `bundle-audit`
so that things never get so bad that I've got a whole major version (or more!) to upgrade.

Having said that, support legacy applications is just something that needs to be done sometimes, and
today I learned a little trick that I've somehow missed in the last 10 years: `rake app:update`.

The Rails Guides actually have this task [documented pretty
clearly](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html#the-update-task) - section 1.4
in fact - so I'm not sure exactly how I missed this.

`rake app:update` isn't magic, but it is helpful. It basically runs the same code path that `rails
new` does when creating an application, but has the same conflict resolution process that normal
`rails generate` processes do when it comes across two files where the newer version is not the same
as the older version:

``` sh
Overwrite /usr/src/app/bin/rails? (enter "h" for help) [Ynaqdhm] Y
       force  bin/rails
```

The options to resolve conflicts here are:

* Y - yes, overwrite
* n - no, keep our version
* a - apply this action to all following files (e.g. when you get to `bin/` you can generally
  overwrite all of those files).
* q - Quit, stop here.
* d - display a diff between the two versions. 
* h - display help, which is basically this list here.
* m - open the conflict in a merge editor of your choice (e.g. VSCode, which can be [configured for
  git to use for conflict resolution](https://stackoverflow.com/a/44549734)).

Out of all of these options, I find `diff` the most useful option, since it gives me an overview of
the changes. I currently manually patch changes that I want to include into the file in another tmux
pane, and then choose to not overwrite the file. My shell is not currently set up with a defined
`mergetool` like VS Code, but I'm definitely going to give this a go next time, since it is
basically a more streamlined process for what I am already doing.

One final note - `rake app:update` is NOT bulletproof. It's not intended to be. It's just a
convenience. As with any change in your application's code or dependencies, _a comprehensive test
suite is the most important feature_. If you are going into any kind of change process, but
especially a framework update without at least some key behaviour tests, stop and add them. It's
incredibly difficult otherwise to check after each change that your application remains functional.


