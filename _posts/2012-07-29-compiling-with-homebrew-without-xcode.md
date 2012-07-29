---
layout: post
title: "Compiling with Homebrew without XCode"
description: ""
category: 
tags: []
---

I'm a big fan of not installing XCode on new Macs. I just don't think it's necessary, unless you're genuinely building OS X or iOS applications.

Instead, I prefer to download the [Apple Command Line Tools] straight from [Apple's Developer Center](https://developer.apple.com/downloads/index.action?=command%20line%20tools), and install everything else I need to with [Homebrew](http://mxcl.github.com/homebrew/). Here's how to do that.

First of all, download and install those command line tools. You're going to need those first of all.

Next, install Homebrew. There are instructions on the site, but the quick version is: 

{% highlight bash %}
/usr/bin/ruby -e "$(/usr/bin/curl -fsSL https://raw.github.com/mxcl/homebrew/master/Library/Contributions/install_homebrew.rb)"
{% endhighlight %}

Once homebrew install installed, you need to install another version of `gcc` (A compiler). There is a version of this that already comes with OS X, but it's pretty old.

Enable the dupes homebrew package, and install an up-to-date version of GCC:

{% highlight bash %}
brew tap homebrew/dupes
brew install apple-gcc42
{% endhighlight %}

Theoretically, you now have the compilers, utilities, and tools you need to set up a range of packages on your Mac. One last problem that I've run into installing packages such as `zsh` and `node`, however, are programs that are run from the compilers to try and find XCode - and fail when they find it is not installed. The error looks something like this:

{% highlight bash %}
xcode-select: Error: No Xcode is selected. Use xcode-select -switch <path-to-xcode>, or see the xcode-select manpage (man xcode-select) for further information.
{% endhighlight %}


The solution for this is to tell these tools that Xcode is 'installed' in `/usr/bin` - where all the compilers are installed:

{% highlight bash %}
sudo xcode-select -switch /usr/bin
{% endhighlight %}

This stops xcode-select from erroring out and halting the compile process, by ensuring that it tries to find the compilers that it requires by looking in the directory where they are already installed.

Once all these steps are completed, you should have a full set of developer tools installed - all you need to compile almost all of the many Homebrew recipes that are available.

---

_Note: The original instructions for setting up command-line tools and gcc-4.2 come from: [http://robots.thoughtbot.com/post/27985816073/the-hitchhikers-guide-to-riding-a-mountain-lion](http://robots.thoughtbot.com/post/27985816073/the-hitchhikers-guide-to-riding-a-mountain-lion). The `xcode-select` fix comes from [this issue report](https://github.com/mxcl/homebrew/issues/10245) on the Homebrew repository_

