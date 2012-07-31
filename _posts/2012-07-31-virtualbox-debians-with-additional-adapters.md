---
layout: post
title: "VirtualBox Debians with additional adapters"
description: ""
category: 
tags: []
---

I get stung by this one all the time, and I can never remember how I fix it. I'm noting it down here, in the hope that next time I'm googling for a fix I'll stumble across my own blog post.

Adding network adapters (or refreshing the MAC address) of a virtual machine running a Debian-based OS on VirtualBox causes a strange problem - the new interface is not listed in the guest after booting, and the network interface device is simply not present.

The fix for this is very simple. Effectively, Debian 'caches' some interface information like the MAC address (which isn't really supposed to change), in a file that gets loaded on boot. When the MAC address DOES change, Debian effectively ignores that interface.

**If you see errors that seem to be causing a missing network interface after adjusting Network adapter settings for the VM in VirtualBox, try the following fix:**

{% highlight bash %}
sudo rm /etc/udev/rules.d/70-persistent-net.rules
{% endhighlight %}

This file gets recreated on boot, so it's perfectly safe to delete - if you're feeling cautious though, you can also just move it somewhere else. Once you've deleted it, just restart the VM, and you should have the correct number of networking interfaces ready to go!
