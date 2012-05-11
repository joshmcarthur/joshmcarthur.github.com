---
title: Using setInterval to handle scroll() events
layout: post

type: regular
comments: true
---

I've just added a nice unobtrusive scroll to top feature to my blog, and learnt
an interesting tip in the process I thought I would share, originating from one
of the many problems Twitter has had with it's jQuery fanciness.
The scroll to top stuff isn't overly complicated - just detect when the user
has scrolled x pixels down the screen, and then show a link to go back to the
top (Which can be animated if you want) - for a nice tutorial on this, check
out_this_tutorial.
The thing is that this technique uses the scroll event (bound to window, but
can be bound to basically anything with a scrollbar). The scroll event gets
fired any time the window is scrolled - but any time the scroll amount changes
at all. What this means is that the scroll event is fired any time scroll
position changes - so if you grab the scrollbar, and pull, the scroll event is
fired every time the bar moves, not when you release the mouse.
John_Resig_reports_that_Twitter_ran_into_some_problems_with_thisÂ - they had a
function bound directly to the scroll event being fired every time anyone
scrolled (at all!). Resig has also reported a nice solution though, which I'll
pass on here. It's actually quite simple. Instead of binding a complicated
function to the scroll event, you simply set a flag variable to let something
else know that the window has been scrolled. The second piece of the solution
is a function running via setInterval - that is, a function being called on a
scheduled basis. The first task of this function is to check this flag - if it
is set, it can perform any task (Such as showing a 'Back to Top' link, and set
the flag variable back to false.Â 
The end result of this solution is that you basically have a polling function,
rather than an event-driven one. This is actually a good thing though, when it
comes to this type of event. Instead of having a complex function called every
time the window is scrolled, a function is called every quarter second or so,
and only executes if the window has been scrolledÂ - much better!
I personally used an object variable, rather than just a flag - this object was
populated with the object that was scrolled on, and I then checked if this
object was populated in my polling function (rather than just is true), and
could then use the context it provided in this function. Since then, however, I
have realized that in my case, this object will alwaysbe the window object - so
I may as well have a cheaper variable assignment and just directly refer to the
object in my polling function.

