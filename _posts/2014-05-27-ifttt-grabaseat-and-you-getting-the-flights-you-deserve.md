---
layout: post
title: "IFTTT, Grabaseat, and You: Getting the flights you deserve."
description: ""
category: 
tags: [guides, ifttt]
---

> This guide covers setting up [If This Then That](https://ifttt.com) to check for flights on [Air New Zealand's Grab a Seat](http://grabaseat.co.nz) service. If you're not at all interested in cheap NZ air travel, this might not be for you.

Grabaseat, Air NZ's discount flights service, has got to be one of the hottest battlegrounds in New Zealand's internet. Popular flights sell out in minutes, and it's up to you to frantically refresh, hoping and hoping to see that exact flight you want, nay, _need_.

In this post I'm going to explain how to set up [If This Then That](https://ifttt.com) to do all this frantic checking for you, 24x7. If This Then That is awesome, and useful for so many things (the essence if these 'things' being: 'when this happens, do that'), so I can't possibly cover everything - instead, I'm going describe this particular trick.

**Note that this seems like a long post, but it's mostly just a lot of detail that you can skim over - in reality, this takes about 5 minutes to set up, and is totally worth it.**

Right, let's get into it. For the purposes of this exercise, let's assume you live in Wellington, but are a traffic enthusiast keen to check out this 'Southern Motorway' you've heard your friends up in Auckland chat about. Traffic enthusiasts don't make much money, so we're after the cheapest flight possible, and we _know_ that traffic isn't going to go anywhere while we look for a flight, so we're in no hurry.

The first thing to do is to [sign up for an If This Then That (IFTTT) account](https://ifttt.com/join) - it's super simple, and will only take a moment - go and do that now. Once you've signed in, you'll see a fun little landing page with pulsing buttons and things that looks a little like this:

![IFTTT Signed in page](/img/posts/ifttt-grabaseat/landing.jpg)

You can explore all the pre-built recipes that are there - we're going to jump right in and create our own. Hit the 'Create' link in the top bar. 

![IFTTT Create Link](/img/posts/ifttt-grabaseat/create.jpg)

First of all, we need to specify the 'this' part of 'If THIS then THAT' - click the bit that says 'THIS' to do that, which will prompt you to select something that the IFTTT team calls a 'trigger channel'. 

A trigger channel can be lots of things, but you can think of it as the _data source_ - where the information we will need will be coming from. To find our flights, we're going to use a handy little service that Air New Zealand makes available to us called an RSS Feed - you can check out the [Wikipedia page](http://en.wikipedia.org/wiki/RSS), but it's basically a list of links, usually sorted by date, that is easy for computers to understand.

If you have a look in the list of trigger channels, you'll see 'Feed' as an option, with a lovely (?) orange logo:

![IFTTT RSS Trigger Channel](/img/posts/ifttt-grabaseat/rss.jpg)

If you click on that, the page will scroll down in a disorienting way until you reach a selection between two options - 'New feed item', which will act every time a new link is added to the RSS Feed, and 'New feed item matches', which will only act if that new link matches a search term. 

Hit the 'New feed item matches' - we don't want to be alerted _everytime_ a new deal is posted on Grabseat, only when the ones we're interested in become available.

![IFTTT RSS Option](/img/posts/ifttt-grabaseat/rss-option.jpg)

After clicking on that bit, you'll be taken to a form where you can specify what IFTTT should look for in new links. What you want to look for is the name of your journey, as Grabaseat shows it on their website - it's usually **City you live in** _to_ **City you want to go to**. Watch out for special cases though - for example, Grabaseat shows flights to 'Napier/Hastings', not to 'Napier' and 'Hastings' - and the search requires that you be exact!

With this example, we're interested in flights from 'Wellington' to 'Auckland', so in the 'Keyword or simple phrase' box, we should type: **Wellington to Auckland**. 

The RSS Feed has a special address that shows the feed information, and it's _not_ just 'https://grabaseat.co.nz' - it's got an '/rss' stuck on the end of that (so altogether that's **https://grabaseat.co.nz/rss**). Feel free to visit that page in a new tab if you're curious to see what that looks like. If you're wondering how I found that out, it's listed down the bottom of the [Grabaseat website](http://grabaseat.co.nz) - it's just not very obvious. 

With both of those things filled in, your form should look like this:

![IFTTT RSS Form](/img/posts/ifttt-grabaseat/rss-form.jpg)

Now you can hit 'Create Trigger', and begin the 'that' part of 'If THIS then THAT', by hitting the word 'That'.

Now, an action channel needs to be selected. If the 'this' bit was the data _source_, you can think of this as the data _destination_. Similarly to the trigger channels, there's a whole bunch of them, but in this case we just want to be emailed when there are matching results, so let's select the 'Email' option (**Note**: Gmail is also in that list - _don't_ select that option, even if you have a gmail account - it's something else, and not what we want in this case).

![IFTTT Action Channel](/img/posts/ifttt-grabaseat/action-channel.jpg)

Once you've hit that, you get one option - to 'Send an email' - click on that to proceed.

Now you get a form that lets you specify what text should be used when flights match your criteria and an email is sent to you. The defaults are fine, but if you'd like to add more text, that's fine too - just type it into the fields. If you'd like to use fields from the RSS Feed, hit the '+' icon next to each field to see what the options are.

![IFTTT Email Form](/img/posts/ifttt-grabaseat/email-form.jpg)

Once you're happy, hit the 'Create Action' button to proceed. You'll be taken back to the 'If This Then That' screen, with the trigger and action you have set up shown. The description is just so you can find the 'recipe' again in IFTTT, so you can leave it as is, or change it if you wish.

![IFTTT Confirm](/img/posts/ifttt-grabaseat/confirm.jpg)

If you're happy, hit the 'Create Recipe' button to lock that in, and then that's created! The RSS Feed will be checked every 15 minutes, and if any flights match, then an email will be sent to you right away with a link directly to Grabaseat. Easy as! 

![IFTTT Email](/img/posts/ifttt-grabaseat/success.jpg)


If you'd like to set up multiple alerts, that's fine - just hit the 'Create' link again to go through the process - the only thing you need to change is your search term when you're setting up the RSS Feed. As an example, I usually set up another alert for the return flight, so that I can match up both legs of the trip that I'd like to do.

Happy flighting!

&mdash; Josh
