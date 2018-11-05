---
layout: post
title: "My notes from Devops Days Wellington, Day One"
description: "My takeaways, notes and links collated from written notes from Devops Days Wellington,
5 Nov 2018"
category: 
tags: [technology]
---

> A little disclaimer: These notes are mostly for me to refer back to in the future, and are based
> on quick handwritten notes I took at the conference. They shouldn't be used as a general reference
> since I may have misquoted, misremembered, or ventured an opinion that isn't quite right.

My DevOps ticket was funded by my employer, [Ackama](https://ackama.com).

## Moving from Ops to DevOps: Centro's Journey to the Promiseland: _Jeff Smith_

The most useful talk for me out of the whole day. Discussed the frequent conflict devops has with
both "dev" and "ops" (e.g. access vs security), and how many organisations attempt to merge two
teams with different context and motivation and instead end up with three teams.

Took job offered as "Devops Manager" - condition of hire was to rename job title to "Production
Operations Director", which makes much more sense.

Align teams and tasks to centralize work. Good questions to explore team boundaries:

* What frustrates you?
* What makes you come to work?
* What makes you not want to come to work?

> **Action Point:** I'm going to trial building these types of questions into my
> stewarding/mentoring meeetings

Jeff talked about how developers didn't have access to set up alerts for the systems they created. I
have experienced similar pains on both sides of the dev/ops boundary. 

> **Action Point:** I'm going to consider how I can open up and make it easier for other developers
> that I work with to understand and create customer-specific monitoring and alerts.

He also talked about how making a dev environment destroyable and recreatable helped to remove some
frustration from both sides of devs/ops. I haven't experienced this specific problem, but am going
to consider staging and UAT environments for some customers being destroyable/recreatable in this
way.

I was prompted to consider what KPIs should be considered for particular sites, and to what extent
these should fit into monitoring and alerts.

He also pointed out that infrastructure-as-code is not really "self documenting" to a sufficient
level, and advised also producing architecture diagrams and some documentation about what key
decisions were made and why.

> **Action Point:** I am going to look at producing both AWS and regular architecture diagrams for
> base Terraform configurations and publishing these internally.

The most useful action point I got from the talk was to define the scope of the operations team.
What is it's primary purpose, which should drive all the work it performs.

> **Action Point:** Prepare draft team charter for the operations team outlining above.

As a final takeaway, it was mentioned that for a larger ops team, keeping track of planned and
unplanned work is useful for understanding the health of the team. I think this is a fantastic idea
that applies to most project teams that have an element of BAU.

> **Action Point:** I'm going to trial this reporting mechanism at the conclusion of my next
> development sprint and report in the sprint review.


## Monitoring that cares (the end of user based monitoring): _François Conil_

This talk was all about monitoring and alerting in the context of the user. One interesting point
was the timezone difference between NZ and US makes it difficult to find times that "aren't
important" for maintenance windows - e.g. a downtime window at 2am in NZ time would be the middle of
the day in the US. Not a concern for what I'm working on now, but valid for larger applications.

They also noted that if everything is classed as critical, then nothing is, describing the concept
of an actionable alert as:

1. Something is broken
2. Customer has noticed
3. You are the person who can fix it
4. You need to fix it immediately

Unless all of these critieria are met, then the alert is not actionable and may as well not be
delivered. 

A recurring idea that I noted for a few talks was to design the KPIs of the application early on in
the development cycle, and monitor these as a primary metric, rather than more low-level metrics.
Monitoring customer journeys can reveal issues that standard CPU/memory/disk monitoring may not
detect.


## Transforming the Bank: pipelines not paperwork: _Mark Simposon, Carlie Osbourne_

This talk was interesting, but was largely around a successful business process/change management
project. I always enjoy hearing about life in larger enterprises. Occasionally I get to hear about
some interesting technical challenges, more frequently about the overhead introduced around having
multiple levels of decision makers and stakeholders.

An interesting note was that ANZ chose a project that was significant enough to the organistion to
prove the concept - internet banking in their case. They started with a 6 week development cycle,
then a 4 week release cycle that was frequently extended. Thye noted that the dev team had a sense
of disconnect with waiting so long before they would see their code in production. They also had a
high deploy cost, since each release would be significant - they staffed this at 25-30 people and
usually had 4-5 hours of downtime.

Most of their change seems to be designed around a Jenkins pipeline that was designed to take their
code right through from a commit against master to production (running tests, UAT deploy, etc along
the way). This allowed them to drop to a weekly release instead of ~10 weeks. 

For testing, they cut their selenium tests and replaced with Cypress. I've done some brief looking
into Cypress, but I'd be curious to know how many Selenium tests they gave up to rewrite, and what
their coverage ended up being - seems like an odd cost/benefit tradeoff.

The other refactoring they performed was to their change management process, getting stakeholders to
sign off on the release process, rather than each release, so they could re-use the signed off
release process each time without needing the overhead of getting sign off.

Mark suggested playing down discussion of 'MVP', and instead focus on value to
the customer. Release small features often, listen to customer feedback, and interate. 

> **Action Point:** I'm interested to talk through this idea with some other developers and
> scrum masters at Ackama, since I think this is a very important distinction in how I might frame
> discussions around a feature or application.

ANZ's release process is now a 4-5 day cycle time to get code into production, followed by a 8 week
incremental release process for canary deploys.


## Fighting fires with DevOps: _Ryan McCarvill_

This talk was way different from how I thought it would be, but because of the structure of the
talk, a bunch of my notes were invalidated. The talk covered hardware/software packages deployed to
fire appliances for Fire and Emergency NZ, and how a capable but complicated system was compromised
down to a really interesting but minimalist solution due to unforeseen constraints (temperature in
this case).

The initial hardware/software involved using a custom orchestrator to pull and run images from Azure
Container Registry onto a hardened Linux box on the appliance, paired with a multi-network comms
unit. A tablet and separate nav screen was used for the presentation of data. The box was
provisioned using Ansible, and both the Ansible scripts and docker image sources were controlled out
of git. This all worked in theory, but in practise the custom hardware boxes would overheat. 

With an impending deadline and all the hardware budget consumed, they ended up drastically
simplifying, moving a lot of the systems that were designed to run directly on the truck into the
cloud, and writing two small systems to run directly on the comms module, which was a locked-down
linux distribution that really just had Java available. One of these systems was a simple static
file server, which would serve off an external USB device, and the other was a search tool that
ended up being written in Rust after all other programming languages available fell over for one
reason or another.

A super interesting talk anyway, and having done a similar project, I got a bunch of takeaways for
next time. I'm still super interested in how an Elixir [umbrella
project](https://elixirschool.com/en/lessons/advanced/umbrella-projects/) would function on a
low-resource hardware unit such as the one discussed in the talk. Especially since a tool like
[distillery](https://hex.pm/packages/distillery) may be able to package up the runtime and
application in such a way that it would just work. 

Overall, it was a super interesting story of reverting back to using nice simple, old style
technology to solve a new problem.

## Open Space Session: Devops at NZ scale

I attended this session, but it pretty quickly went off-topic without an external facilitator,
turning into a discussion about how devops functions in different teams, and even a whip-around of
job offerings. I didn't speak up in this one as it took me the entire session to figure out the
nature of the discussion I wanted to have. I eventually figured out that I attended the session
hoping to have a discussion about "Devops at _small_ scale" (small == NZ really). I work for a
services company, so unlike our (generally) larger project company buddies, we're usually just
setting off our customers on their journey, and doing so to the best of our abilities. Devops work
is inherently constrained and limited at this stage, so I was interested to get an answer here.

## Open Space Session: Devops for startups

The above session led nicely into this one, since my colleagues and I had just come from the
previous session, and found the topic to be pretty much what we were after. The takeaways I got from
this discussion was to start small and with a consistent kind of approach in mind. It's always
better to start with infrastructure-as-code rather than retrofitting this, and doesn't take much
longer, if it takes longer at all. Generally it's a good idea to dockerize applications from
scratch, but this does require balancing as to whether it will be maintained or is suitable for the
platform in question.


## A Trip Down CI/CD Lane: _Everett Toews_

This was just a five-minute talk but I still found it interesting. An overview of CI/CD platforms
and their pros and cons. 

## Creating Shared Contexts: _Jeff Smith_

Another 5 minute talk, with SO much packed into it. Jeff was back talking about establishing
contexts that are shared between teams, and the importance of making sure that context was being
communicated, not just a problem, or even worse, a pre-envisaged solution (that the other person may
think is the only option). Jeff encouraged thinking about problems, not solutions.

> **Action Point:** Getting teams to agree on goals, constraints and priorities is super important
> for teams to function (both within and without the team). I'm going to work to incorprate these
> into future sales pipelines through to project charters and retrospectives.


## 2018: A Build Engineer's Odeyssey: _Peter Sellars_

Another 5 minute overview of a bunch of different tools that a Node.js pipeline engineer might be
faced with coming into a role as a dedicated "devops person". It was mostly material that had
already been covered/I'd already picked up (it was intended to be a high level overview, I think).
The main takeaway I got that was slightly unexpected was `npm ci`, which is probably what I want to
be using within Rails and Phoenix projects when I just want my locked dependencies (e.g. during
Docker builds).

## Testing in DevOps for Engineeers: _Katrine Clokie_

This talk was great, but by now I was getting pretty tired. I really wanted to concentrate since
I've been deep diving into testing recently, and it contained some really useful lessons around an
entire project team's culture revolving around testing. Katrina intercepted really well with
François's talk about monitoring, coming at the same idea from a testing perspective around driving
testing, development and ops processes based on customer journeys and application purpose rather
than just "standard metrics". Something to consider for my projects:

> "What questions are you asking of your product that you know it's good, it's ready?"

> **Action Point:** Pick a reference project and consider what healthchecks, KPIs, and possibly a
> sample of intergration or system tests that could be run to continuously test application quality
> after release.

> **Action Point:** Check out "A Practical Guide to Testing in DevOps" by Clokie. 

---


