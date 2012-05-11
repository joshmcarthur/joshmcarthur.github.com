---
layout: post
title: "Introducing Blog Broadcaster"
date: 2011-09-14 19:04
comments: true
tags:
  - development
  - sinatra
  - github
  - opensource
---

I've just completed a Blog Broadcaster for this blog. It had a couple of interesting technical things, and I needed to test it properly, so here's this post!

I recently migrated this blog from [Tumblr](http://tumblr.com), and while Tumblr was pretty awesome and easy to use, it didn't have great support for blocks of code and preformatted comment, and, like [Radiant CMS](http://www.radiantcms.org), it stored layouts, stylesheets, and all of that kind of thing in a database somewhere - it wasn't in source control, and making changes to it was dangerous.

One thing that I immediately missed from Tumblr, however, was it's ability to post to Facebook and Twitter automatically whenever I published a post. As I don't post that often, it's really important to me that I market my blog as much as I can - like my Github profile, the content on my blog is a reflection of my knowledge and skill as a developer, and so I want to get that in front of people as much as possible - broadcasting to social networks is a great way of achieving that.

With my blog on Github, I needed a way to broadcast new posts to these social networks. Github has a built-in post-receive hook to post to Twitter, but I really needed something more than that. Here's my list of requirements:

* It should automatically post without me needing to do any special task
* It should be conditional - i.e. it shouldn't post *everytime* I change something
* It should support both Facebook and Twitter
* It should be able to be triggered by a commit

What I ended up building was a Sinatra app whose sole purpose was to receive POST'ed commit information, parse it into a Facebook and Twitter post, and broadcast it. It's hosted on Heroku, and gets triggered by a Github [Post-Receive Hooks](http://help.github.com/post-receive-hooks/). I did run into a couple of problems along the way - the main one was sorting out being able to post Facebook updates without being logged in, or even needing to be involved at the process at all. This wasn't too difficult, but I did need to get an access token that was long-lived, and have the ability to update this if necessary. I overcame this problem by adding some methods to my Sinatra app that will allow me to update the access token if it ever expires, or change the Facebook account used if necessary.

The second problem I ran into wasn't really a problem, but it was a challenge to try and think of a nice way of doing it. Basically I needed to store the Facebook access token somewhere so that I could use it when I needed it - but I didn't have a database, and I didn't particularly want to add one just for storing a single string. Since this is running on Heroku (Bamboo stack, not Cedar), I was also on a read-only filesystem, so couldn't store it in a simple text file either. In this end, I chose to store the value in Memcache using the Heroku add-on. This still isn't necessarily a good solution, as this storage method isn't guaranteed to be persistent, however it should suit my needs - it doesn't particularly matter if I lose the access token, the application will gracefully degrade and just post to Twitter until I log in to Facebook via the app again.

So, I think I've come up with a good solution. It started off as a simple broadcaster for my blog, but I think it has a lot of potential for use with any open-source project that has social networking presence - I think it's a much more elegant and flexible hook than that which Github provides, and I hope it get's a bit of use.

