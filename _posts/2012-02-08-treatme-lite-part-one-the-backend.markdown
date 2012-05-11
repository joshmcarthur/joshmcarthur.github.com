---
layout: post
title: "Treatme Lite: Part One - the Backend"
date: 2012-02-08 21:07
comments: true
categories:
  - nodejs
  - coffeescript
  - javascript
  - backend
---

The Backend
----
> This article first is in a series of three blog posts documenting how I created [TreatMe Lite](http://treatmelite.herokuapp.com), an HTMl5 web app using Zepto.js, Coffeescript, and a range of other frameworks and tools, all backed by an [Express JS](http://expressjs.org) web service. See my [previous post](/2012/02/06/treatme-lite-adventures-in-javascript/) for more information about the application.

Last post (the intro), I left off explaining why I set out the build the application, and the technologies I had selected to build each part. This post is going to detail the steps I took to create the web service using [NodeJS](http://nodejs.org) and [Express](http://expressjs.org).

First of all, I needed a way to serve the deal JSON. In actuality, this is something that I could have done just as easily directly from the front-end Javascript, however, I'd started off with a NodeJS application, and it seemed just as sensible to request the JSON from [TreatMe](http://treatme.co.nz) using Node's [support for HTTP requests](http://nodejs.org/docs/latest/api/http.html#http.get).

To kick off the node app, I cloned a starter application from Github:

```
git clone git://github.com/twilson63/express-coffee.git treatmelite
```

This application gives us an easy base with support for [Coffeescript](http://coffeescript.org), [Jade templating](http://jade-lang.com/) and a bunch of other CSS stuff, like the [Skeleton grid](http://getskeleton.com) (which I'm a big fan of).

To satisfy the requirements for the front-end, my NodeJS application needed to perform two tasks:

#### /deals/:latitude/:longitude: Retrieve a list of nearby deals from TreatMe

The code:

<script src="https://gist.github.com/1766753.js?file=app.coffee"></script>

Explanation:

* First, we make the HTTP request, passing a callback that will get a response object as an argument
* We listen for certain events while we receive the data from the response - if we hit an error, we return an error message. We listen for when we receive some data, and append it to the string we want to return to the front-end, and when we reach the end of the data, we return this string.

#### /geocode: Geocode an address, and pass back the information we need to display to the user

The Code:

<script src="https://gist.github.com/1766776.js?file=app.coffee"></script>

Explanation:

* We build the path to the Google Geocoder using either the latitude and longitude from the user's current location (i.e. reverse geocoding), or the address (typically a city name like 'Wellington, New Zealand')
* We follow a similar pattern to the Deals action, requesting a geocoding result, waiting for a response, and parsing the data we need out of that response. In this case, we build a JSON structure containing the geocoded address, it's latitude, and it's longitude.


> A note on Geocoding: We use [Google's Geocoding service](http:// code.google.com/apis/maps/documentation/geocoding/) to retrieve the information we need from either the name of a location, or the latitude and longitude (either way, it fills in the information we need). Once again, this is something we ideally would do from the front-end, however, I ran into some cross domain issues, and so simplified matters by performing the request on the server

