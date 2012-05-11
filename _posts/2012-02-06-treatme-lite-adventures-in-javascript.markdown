---
layout: post
title: "Treatme Lite: Adventures in Javascript"
date: 2012-02-06 21:01
comments: true
categories: 
---

For a long time, I've been looking to move into the [NodeJS](http://nodejs.org) trend that's been taking the development community by storm. The problem is that coming from a Rails development background, and my inability to follow callbacks through more than 2 levels, has lead to my previous efforts to end in broken code and frustration.

Happily, however, I took another look at [express](http://expressjs.com), a Sinatra-like framework for NodeJS, and it clicked with me on a level that vanilla Node had not in the past. It supported middleware, was reasonably well-documented, and I was able to find [a handy project on Github](https://github.com/twilson63/express-coffee) which allowed me to start from a solid base of proven middleware and NodeJS modules to help me out (I typically now develop in [Coffeescript](http://coffeescript.org) for my personal projects - I enjoy the ability to code in something that takes my missing knowledge of how to write beautiful Javascript into account).

Next, I needed something to build - ideally something I could become reasonably passionate about finishing, but that also would not consume more than a week or so of working in the evenings. Something I've been using recently is [TreatMe Now](http://treatme.co.nz/now) - a sort of customers-on-demand voucher system for retailers that is updated throughout the day with some really good deals - typically, these last only a couple of hours though, so it's important to check quite often. Something else I had lamented is that, while there is an iPhone app available, there was no mobile web support, no support for other devices, and the normal web interface is chock full of data-heavy maps and unfriendly panels that are, frankly, downright annoying to use on a smartphone.

Using Chrome's web inspector, I was able to find a JSON feed of deals, and work out how to filter the results to a particular region. Given this datasource, I was ready to begin building out this experiment, using a number of resources I've wanted to try out in more detail - NodeJS, Express, more in-depth HTML5 things, responsive design, and an adaptive grid system (Normally I use [Twitter Bootstrap](https://twitter.github.com/bootstrap), but I made a conscious effort to keep things light, using Skeleton's adaptive grid system, and Zepto.js in place of jQuery). This blog post is going to detail how I went about building backend and fronted of the application, to the point where I've got [The Final Product](http://treatmelite.herokuapp.com), an express-backed single-page application supporting offline access, local storage and a fully responsive design.

Over the next three posts, I'm going to be documenting how I went about building a responsive and HTML5-based web application to serve TreatMe Deals, using NodeJS, Express, ZeptoJS,  Coffeescript and the Skeleton CSS framework, including difficulties I ran into, and how I solved them:

* Part One: The Backend - an examination of my basic web service written in [Express](http://expressjs.org) which serves a JSON datasource of deals, and makes calls to Google's Geocoding service
* Part Two: The Frontend - a look at the Javascript and CSS tools I used to develop the frontend of the application
* Part Three: Responsiveness and Extras - some detail about how I added support for offline asset caching and local storage of deals, and made additional tweaks to make the application work fully offline.

