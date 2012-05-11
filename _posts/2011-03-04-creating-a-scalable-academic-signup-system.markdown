---
title: Creating a Scalable Academic Signup System
layout: post

type: regular
comments: true
---

While working at 3Months as a developer, I am also completing a Bachelor of
Business Information Systems at Victoria University. One of the things that
rolls around twice a year and always causes students headaches is the signups
systemÂ - it's one of the bragging points of the School of Information
Management at Victoria, as it was build as a project by a group of students
there (Hence the name 'S-Cubed = SSS = SIM Signups System). In itself, it's a
good application - it fulfills it's brief of managing signups for tutorials and
workshops, and lecturers and students alike seem to have no huge issues using
is. The problem is though, is that its performance under load is crap - it
simply was not build for the load that it receives when tutorial signups for 2
courses of 700 people each opens at 9am, and each of those 1400 people trying
to get the exact tutorial they want are continually refereshing the page and so
exacerbating the server load even more.

This server load doesn't just extend to slow page load speed - since the site
has not been build with scalability in mind, there have been ongoing issues
with sessions expiring as people try and signup for a tutorial or workshop,
people stuck halfway through a transaction, and the server even goes down every
now and then.
What I am proposing is an open framework that takes the best aspects of this
type of system, and builds upon it techniques to optimize page load speed, and
increase scalability. It seems to me that Universities in general are lacking a
system that allows them to smoothly run signups (usually they are dependent on
modified forum software, paper signups, emails or proprietary in-house
systems), and so this isÂ definitelyÂ something that is marketable around the
world.
As I see it, here are the base requirements for such a system:
    * LDAP and OAuth Authentication so that students do not need to 'register'
      to sign up for a tutorial
    * Accurate time-based releases of tutorials and workshops that do not
      require human intervention
    * Automatic server load monitoring with the ability to increase allocated
      resources if necessary (i.e. this application is an ideal candidate for
      Rackspace Cloud or Heroku)
    * Per-course and per-University analytics for better scheduling of tutorial
      and workshop release times and how students are accessing the system.
    * The ability for lecturers and course administrators to export and print
      class lists, tutorial lists, and workshops list with all student data or
      just a subset.
This project isÂ definitelyÂ going on theÂ work pileÂ for my personal projects
- it's got a couple of interesting aspects to it which I haven't approached
before (Such as LDAP from Rails), and generally seems to follow along with my
ethos of community-oriented 'responsible web applications'.

