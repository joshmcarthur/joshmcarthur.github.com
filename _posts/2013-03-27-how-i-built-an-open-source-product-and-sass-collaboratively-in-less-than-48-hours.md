---
layout: post
title: "How I built an open source product and SASS collaboratively in less than 48 hours"
description: ""
category: 
tags: []
---

Last Friday, I headed off to [Railscamp NZ](https://twitter.com/Railscamp_NZ) with one guy from work, 8 cans of V, and a bag of carrots (my snack food of choice). Today it's Wednesday, I've still got 8 cans of V, a few less carrots, one open-source application that I'm actually happy with (and [Travis CI](https://travis-ci.org/joshmcarthur/inquest) and [CodeClimate](https://codeclimate.com/github/joshmcarthur/inquest) say is pretty well put together), and one deployed-to-production, used-and-valued-by-a-company SASS based on said application. 

## About Inquest

Inquest is a bit like [StackOverflow](http://stackoverflow.com) - but it's designed for those questions that aren't for the public. Just observe in your job how often questions like these get asked:

* "How do I do x?"
* "Why won't x work?"
* "Is this the best way to do x?"

The idea behind Inquest is to move these questions into a area that focusses and preserves valuable and insightful questions and answers, reducing the need to constantly re-ask the same questions.

> If you think Inquest might be interesting to try out, you can either download the source code of the [open source version](https://github.com/joshmcarthur/inquest) on Github, or if you're not too technical or want it to "just work", [Send me a Tweet or PM me on Twitter](https://twitter.com/sudojosh) to find out more about an organization account.

## About Railscamps

For those who don't know about it, the general idea of a Railscamp is to disappear off somewhere into the wilderness with a bunch of other developers, and do whatever you feel like - whether that be socializing, running or attending presentations, or playing what seem to be constant and/or long-running games of [werewolf](http://en.wikipedia.org/wiki/Mafia_(party_game). It's great fun, and a fantastic way to learn new things and expand your technical (or social) horizons.


## Timing

When I headed there on Friday, I already had the expectation that I was basically going to be heads-down coding an app all weekend. As it turns out, I more or less spent the first night and all of the next day just socializing and going to talks - I just couldn't get into coding. I'd already had an idea for a private, host-your-own version of StackOverflow (based on many senior developers I've seen who are constantly barraged by the same questions about the same projects), so I had a bit of a plan in my head. Here was my timeline for the weekend:

* Friday - Sunday morning: initial build
* Sunday morning - Sunday evening: finishing tests, and adding more features.

In reality, by Saturday afternoon, I had serious doubts that I would even bother continuing on the application, let along finishing the initial build before the end of the weekend. I remember talking to my partner on the phone, when asked how it was all going: "Meh - the socializing is good, but I just can't get into my project". In the end, I would actually say that **starting** on Sunday was the best possible motivation for me - it turned from building into a product into _what the hell, let's just see how much we can get through in a day_.

## Collaboration

One of the real benefits of a Railscamp is it tends to attract pretty damn competent developers, who have basically set aside the weekend to work on stuff. Having said that, this is a area where I really could have done better - after all, "_I'm working on an open-source host-your-own question and answer site, but it's not going that well_" isn't the best pitch - to anyone. Despite that, I was lucky enough to already have one guy on board from work, and had various people helping out throughout Sunday, mostly on questions along the lines of "Am I doing this right?". In the end, what became obvious to me was **the value of everyone involved in building a product being in the same place - not just in the same room, but at the same table, in the same mindset, with the same vision**. In the case of Railscamp, this involved 3 or 4 of us sitting at a table, constantly communicating what we were working on, all with the same (albeit not very businessy) vision of _let's just do what we can in a day_.


## Management

By Suday morning, it was pretty obvious that we were going to have to do some pretty intense work to get to the point we're I'd be happy with what we'd done - it was going to need more than one person working constantly throughout the day to get everything done that I wanted to. 

To help keep track of everything, I borrowed a technique from [my employer](http://3months.com), and set up a [scrum](http://en.wikipedia.org/wiki/Scrum_(development)) board, based on a tool that I use every day called [Trello](https://trello.com) (I suggest that you check this out if you don't already use it!) here's our board by the end of Sunday:

![Inquest 'Trello board'](/img/posts/inquest/board.jpg)

We stuck this up on the wall, and simply got everyone to update it as they went. No daily standup (obviously this wouldn't have been much use to us!), just a real-time board that was a glance up away when anyone needed to see where a feature was at, or needed something new to work on. Because this board was "public", we also got a few people wandering past and offering help or suggestions for features, which was a great way of passively brainstorming for ideas beyond those we had already identified as parts we wanted to build it.

Another part of the management of the build was just the collaboaration. Because the board was right there, and so were us developers, we mostly relied on verbal announcements to know where things were at - and this worked really well. Just little things like being able to find out exactly where _feature x_ was at, what technnique was being used for _feature y_, or whether _feature z_ had been merged fully into master yet, made the whole thing really easy to manage, and I'm really happy with how this part of it went. We also made extensive use of a [Github Enterprise](https://enterprise.github.com/) instance to manage the code quality and merging with pull requests, which meant that throughout the day, our master branch was (almost!) always working - even if we were building 4 new features at different points of completion in at the time.


## Open-Source vs Product

Something that I don't get to do very much in my day-to-day job is develop SaaS products - so this seemed like a great opportunity. Despite that though, I'm very much in agreeement with Github's ethos of [open-sourcing everything](http://tom.preston-werner.com/2011/11/22/open-source-everything.html), and so the last thing I wanted to do was get all these people working on a cool little project that was just going to become another product. 

What I did instead was arrive at a middle ground - I would develop the core of the application fully-transparently, alongside all the other developers I could find who wanted to work on Inquest, and push this to Github as a ready-to-roll Rails project. Anyone who wanted to use it for anything can download it, install the dependencies, set up the database and use it. To satisfy my desire to work with a 'product' though, I have also made some further developments to make a hosted version of Inquest available to anyone who is either not comfortable setting up an open-source version of the application, or does not want to go to the bother of hosting and maintaining their own version (or both!). 

The 'product' version is exactly the same as the open-source version, but with support for multi-tenancy, and with all data secured and scoped to a company-specific subdomain (for example, http://3months.inquestapp.com). Right now, there's no company sign-up available, while I get it to a point where I'd be comfortable charging for access - when I do get to that point though, I plan on charging just enough to cover my hosting costs, and hopefully my time to continue adding features to the open-source version of Inquest. I've seen this done before, and its worked quite well - helped by the fact that I have a full-time job that can quite easily cover my rent if people just end up preferring the open-source version.

I'm really happy with how I've got these two versions working. The open-source version seems to me like a really good idea to help people try out the idea and the application, and will hopefully foster some pretty rapid completion of features (I know that at least a few of my workmates are already looking at building in a few things). The producticized version though will, over time, hopefully have some modest growth, to the point where I can fund my work and offer the best support I can on both versions of the application.

## Outcomes

I'm blown away with how much I got done - and really quite pleased with a few developers who stepped into unfamiliar territory to try and get this built. The application's certainly not finished, but it's also not spartan - everything that I really wanted to be there, is there, working, and being used. I've got a lot of improvements I still want to make, and I'm already taking advantage of the velocity I achieved during the last weekend to power through a few of the tougher features I wanted to start. 

Here's the timeline of what I got done, when:

* **Friday night:** ran `rails new`, created application, promptly stopped development for the night and went and socialized.
* **Saturday night:** spent an hour doing the 'Users can log in' story. Promptly stopped development and went and socialized.
* **Sunday morning:** started development on the application in earnest with the ability to create questions. Designed log in pages.
* **Sunday lunchtime:** ability to create questions, answers, and mark answers as accepted.
* **Sunday evening:**  ability to vote on questions and answers, search for questions, and invite users.
* **Sunday night:** worked on commenting on questions and answers, polishing interface. Demonstrate working application deployed to camp server in front of all Railscamp attendees.
* **Monday morning:** travelled home, added multi-tenancy for hosted version (multiple organizations can have completely seperate data).
* **Monday early-afternoon:** purchased domain name, production server and set up production server running application. Done!
* **Tuesday morning:** set up organization account for my employed, was immediately used and continues to be used.

And the overall outcomes of this whole project are:

* I have a bunch more knowledge in activity and event tracking, layout and design, rapid development & testing and presenting in front of a large group of people.
* I ran a development team at a ridiculous pace, and managed the codebase to a point where there's not really any really smelly code.
* I pushed a complex Rails app as an open-source project on Github, and set it up with Travis CI to automatically run the application's tests on multiple versions of Ruby, and CodeClimate to automatically analyse the code quality.
* I augmented a project I had open-sourced, turned it into a product, and open-sourced it - in a day.
* I had fun! And I still have fun!

I can't really emphasize that last point enough - I went to Railscamp not to develop a kickass project, or product, but to learn new things, meet new people and overall, have fun. **I'm really, really happy to say that a kickass product just happened to be a fringe benefit of having all that fun!**

> If you'd like to try out Inquest, feel free to [check it out on Github](https://github.com/joshmcarthur/inquest). If you or the company you work at would like to try it out and see if it's a good fit with you, feel free to [get in touch with me](https://twitter.com/sudojosh) - I'd love to hear from you. If you don't think it's for you - that's fine as well! I'm constantly adding cool stuff to the open-source project though, so if you're a developer, and you would like to support the project, please star it on github:

![Inquest on Github](/img/posts/inquest/github.jpg)



