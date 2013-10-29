---
layout: post
title: "Take advantage of Rails data attribute transformation to clean up your UJS"
description: ""
category:
tags: []
---

As a Rails developer, you'll almost certainly need to do some unobtrusive Javascript in your applications - in fact, if you use Rails' `jquery-ujs` gem, it's almost encouraged!

Without writing any script yourself at all, you can have a form button that disables itself with a message while the form is submitted by simply constructing your button like so:

{% highlight erb %}
<%= submit_tag 'Submit', disable_with: 'Submitting...' %>
{% endhighlight %}

Which becomes:

{% highlight html %}
<input type="submit" value="Submit" data-disable-with="Submitting..." />
{% endhighlight %}

With Rails 4, however, using the `disable_with` key directly has been deprecated - instead, Rails prefers that you place this attribute within a hash of `data` - presumably to more closely resemble the HTML attributes - like so:

{% highlight erb %}
<%= submit_tag 'Submit', data: {disable_with: 'Submitting...'} %>
{% endhighlight %}

Interestingly though, I have noticed that _any_ hash keys placed within the `data` hash will be transformed into [HTML data attributes](http://html5doctor.com/html5-custom-data-attributes/) - and most importantly, you can continue to use symbols, not strings, as the hash keys will automatically have underscores replaced with dashes, so:

{% highlight erb %}
<%= submit_tag 'Submit', data: {disable_with: 'Submitting...', collapse_element: '#share-modal'} %>
{% endhighlight %}

Becomes:

{% highlight html %}
<input type="submit" value="Submit" data-disable-with="Submitting..." data-collapse-element="#share-modal" />
{% endhighlight %}

This is a really neat enhancement, and I've already found myself using it regularly. It makes it easier to stick with Rails helpers, even when binding to complex Javascript behaviours, and produces much neater template code.

