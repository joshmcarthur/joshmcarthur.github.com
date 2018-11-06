---
layout: post
title: "My notes from Devops Days Wellington, Day Two"
description: "My takeaways, notes and links collated from written notes from Devops Days Wellington,
6 Nov 2018"
category: 
tags: [technology]
---

> A little disclaimer: These notes are mostly for me to refer back to in the future, and are based
> on quick handwritten notes I took at the conference. They shouldn't be used as a general reference
> since I may have misquoted, misremembered, or ventured an opinion that isn't quite right.

My DevOps ticket was funded by my employer, [Ackama](https://ackama.com).

## DevOps Experiments: Reflections of a Scaling Startup: _Alison Polton-Simon_

This talk was a great start to the day, covering an organisational change that many smaller
companies would emphasize with - offering support and ops resources to teams and customers in a
growing company without affecting development velocity.

Alison's talk started with an agenda, which I really liked, as it helped to frame the talk and the
direction it was going in. The next slide laid out her employer's values, which I also really
appreciated being visible and upfront. 

> **Action Point:** The attribution against the key values slide was
> [keyvalues.com](https://keyvalues.com) - look at this to see if Ackama's written values can be
> published publicly.

One of the core question Alison suggested teams, and companies ask of themselves is "What
does reliability means to us?". 

> **Action Point:** In my previous day's notes, I identified an action point to identify and
> document the strategy and purpose of operations at Ackama. I would extend this discussion and
> documentation to include defining what reliability is, for Ackama and our customers.

The remainder of the talk covered a journey through a number of team structures to try and alleviate
pressure from developers tasked to deliver features. I really emphasied with this points in this
part, as it's something I'm actively experimenting with. It was useful to see where we are along
this track, and to also pick up some potential challenges and strategies for overcoming these in the
future.

Alison described three team structures:

### Tributes

This was the first team structure they tried out past their initial "everyone does ops, rotating
pager duty", just-in-time approach. A tribute was a rotating single engineer whose full time job it
was to handle ops tasks, triaging support, supporting customers, and protecting the feature
development team. The tribute person rotated every now and then.

Pros:

* More sustainable than a whole-team system
* Fewer interruptions
* Chance to build up context around support and ops tasks
* Opportunities to undertake longer-term ops and support tasks

Cons:

* Customer service _declined_
* Hard to hire for (needs to be able to do everything)
* Hard to invest and grow the team - tribute always either fighting fires or trying to catch up with
  support.


### Collectives

The movement from tributes to collectives was based around one person not being scalable - from 
hiring, technical, support quality or human perspectives. This team was intended to support
specialisation of of particular team members, especially in regards to customer support and ops
work. The collective rotated quarterly, allowing knowledge to be accrued both in depth and breadth.

Pros:

* Better focus for devs and support/ops people
* Accrued platform support knowledge
* Crosstraining and opportunities

Cons:

* Development teams don't support what they build
* Juggling act to load balance tasks 
* Context switch cost both per-task and per-quarter
* A quarter isn't actually that long when you incorporate the time required to get up to speed and
  handover.

### Product Teams

The current iteration of team structure sees developers with support capability, developers with ops
capability, developers and other cross-functional team members forming into product-focussed teams
with capability to work reasonably autonomously. These teams are designed to align with business
verticals rather than technical platforms (I imagine this means they could easily involve
marketing/sales/BA/other business roles in the teams with ease if this doesn't happen already).
There is no 'ops team', since individual product teams own their own tools and systems. Each team
has KPIs and goals to meet against which success is measured. 

> **Action Point:** Currently I work as part of a team that exists across several work streams,
> largely for resourcing convenience - it's easier to allocate a project to a team rather than a
> specific person. Consider what measurable KPIs could apply to such teams.

Since the customer/developer ops support tasks didn't go away with the move to product teams, the
tribute model was retained, however this role was constrained to one tribute per team. This meant
that the scope of work the tribute is expected to complete is reduced, and constrained to projects
that the team already works with on a day-to-day basis (or at least has build experience of). 

> **Action Point:** Consider how a tribute system could work within the resourcing teams described
> as above. How much of a cultural/process change would be required to support this?

There were some challenges outlined with product teams:

* Teams owned projects without necessarily holding responsibility for supporting projects. This was
  the main motivation to the tribute being introduced as I understand it.
* Cross-organisation consistency and knowledge sharing is hard
* Need to prevent a return to the tribute system where one person gets lumped with all the
  non-feature-dev tasks
* Coordinating product teams takes more work than a single development team (this is for a startup
  or other organisation that would normally have a single dev team).

While wrapping up, Alison also mentioned an engineering consititution, and it's benefits in working
towards consistency, which I thought was a great idea. The engineering consitution is a collection
of basic principles which new hires agree to meet. The constitution is a living document hosted on
Github and is continually revised. 

> **Action Point:** Research existing engineering consitution documents and begin a process to
> formalise such a set of principles to be published publicly. Most of these principles have already
> been documented, they just need to be centralised.

## Lean QA: _Theresa Neate_

I found this talk really interesting with lots of potential for my human ops work with stewarding
and mentoring. It was one of a few talks this conference covering the need for testing and QA to be
baked into the entire software development, release and post-release support cycles. 

A recurring theme of this talk was T-Shaped people. I hadn't come across this term before, but it
relates to people who have general skills in a range of areas (the wide top of the 'T'), and
specialised skill in one precise area (the bar of the 'T'). 

> **Action Point:** Consider how I could work with my mentees to figure out their 'T' and how they
> can focus on general or specialist skills.

Theresa also redefined Quality Assurance as Quality Analysis, which I found to be a really good
reframing of how I see QA fitting into development processes. Ideally, they are involved throughout
the software development process, and should not be seen as gatekeepers with a pass/fail role -
instead, they should be seen as generalists with a specialisation in testing who can find potential
problems or quality issues in features, and provide assistance and advice to work with whoever
necessary to resolve these.

Theresa's role was described as "Developer advocate role". She compared herself to Kelsey Hightower
(a well-known Kubernetes developer advocate at Google), but internal facing rather than external
facing. This role really reasonated with me, since my professional focus in the last few months has
been to introduce some consistency in the tools and processes used at my workplace to deliver
unsurprising, high-quality code.

> **Action Point:** ["The Phoenix
> Project"](https://www.oreilly.com/library/view/the-phoenix-project/9781457191350/) was recommended,
> reminding me that I should circulate this novel yet again within Ackama.

> **Action Point:** Review a presentation from 2008 called ["Agile
> Infrastructure"](http://www.jedi.be/presentations/agile-infrastructure-agile-2008.pdf) that was
> mentioned several times.

## A Devops Confessional: _Mrinal Mukherjee_

Not many notes from this one. I enjoyed the term "DevOops", and the monkey slides.

There were three devoops situtations that Mrinal identified:

### "One-track Devops"

* Same process for each new devops project
* Take care of the low hanging fruit, get short term wins
* Automate infrastructure, cos it's _cool_ and easily understood
* Become bottleneck as the "devops person"
* Become only person who can build and release the app
* Discover that process and culture is causing issues, not just technology
* Business doesn't see results because only low hanging fruit is done, no actual painful problems.

### "MVP-Driven DevOps"

* Get stuff done fast
* Start saying things like "We'll fix it in the next sprint" (no future sprint planned)
* Acrue technical debt
* Make compromises with quality and security
* Hard to maintain code
* Slow to build new features because of tech debt, unplanned architecture and quality issues

Can be somewhat avoided with:

* Peer review (of architecture, approach and consistency, not just bug spotting)
* Minimum engineering standard (analogous to the "engineer constitution" described above)

### "Judgemental DevOps"

* Delays from other parties/teams
* Not understanding the context of changes
* Blame Driven Development - blame the other teams, other staff
* Become stubborn and defensive
* Results in conflict - even as minor as body language can be a giveaway

Mitigate with:

* Empathy and shared context with other teams, processes and individuals
* Understand goals, constraints and priorities
* Collaborate on problems to create solutions

## Kubernetes/OpenShift Open Session

A somewhat interesting session where a bunch of large kubernetes deployments talked about the tools
they used for logging, monitoring, secret management, configuration and networking. Some little
takeaways I got:

* ~50% people in the room used Kubernetes
* ~2% used Kubernetes via Google
* ~2% self-hosted in public clouds (AWS, Azure, Google)
* ~2% V-Sphere
* ~5% OpenShift
* ~1% Rancher (possibly the rancher rep?)
* Mostly people had a cluster size of 4-5, some with many more
* Mostly people ran 10-20 nodes in a cluster
* Storing state is normally the hardest bit (databases, static files)
* It can be done, overall don't run DB in containers unless it's throwaway (e.g. integration
  testing)
* Majority of people using ECR as the container registry. Some using OpenShift's internal registry.
* Logging stacktraces as JSON blogs is good for busy logs since it's all on one line
* `kubectl top` and `kubectl` state metrics are good for monitoring
* Ansible and ansible tools (ansible vault, etc) were far and away the most common thing used

## Monorepo/shared libraries Open Session

This session didn't end up being super relevant to me, aside from a couple of little snippets around
where infrastructure vs orchestration vs app code should go.

## Ignite Session: Continuously Testing govt.nz: _Allan Geer and Amanda Baker_

An interesting lighting talk covering the constraints of CWP/Silverstripe that I've noticed is
typical:

* Low motivation to regularly update
* High risk/cost upgrades
* Little to no testing

Additionally, being in a government department, approaches to agile can be interesting. Their
flavour of agile was described as "micro-waterfall agile". Sounds about right.

Allan and Amanda introduced test coverage to govt.nz websites by building the creation of Gherkin
test cases into story writing sessions with the product owner, devs and testers. They created an
initial stocktake of features to describe existing systems and then prioritised to discove the most
important scenarios to test. They then made sure their test metrics were visible to the product team
to motivate further testing.

> **Action Point:** Document strategy of stocktaking existing application features and prioritising
> important revenue/customer generating features as part of legacy app discovery processes.

## Ignite Session: Configuration Pipeline: Ruling the One Ring: _Jules Clements_

Another quick lightning talk about release processes and separating "deployment from
"orchestration". I was also reminded of an additional requirement of a deployment pipeline that I
don't often consider, which is to ensure that the output of a pipeline is a uniquelely identifiable
artifact that can be repeatedly deployed (i.e. deployed, rolled back, and deployed again). A Docker
image has these traits, and that's probably the artifact that was intended, but it's an additional
note to make sure that deployments using tools like Capistrano also share these traits (for example,
Capistrano deploys to release folders, and points to the "current" one using a symlink. It also
writes the hash of the git commit that was deployed into the REVISION file in each release.

> **Action Point:** Come up with a good definition of orchestration I can get my head around

# Conference Takeaways

Overall, the conference was OK, but not great. The scale and type of work I do means that I need to
constantly translate many of the things I'm hearing in talks down to a much smaller scale, and then
decide whether they are problems I have, or if they are, if they are actionable. I think talks
covering smaller-scale devops would have been interesting. There were a couple of talks that were
this kind of thing, but they mostly covered scaling devops _teams_, not devops _processes_ and
_technologies_. 

My main high-level ideas to delve into more:

* Develop ops capabilities within each project team. Don't have an "ops team"
* Formally define 'ops' - it's goals, mandates, and measurable KPIs
* Define KPIs for a project that can be built into healthchecks and monitoring early on in the
  project
* Focus on value to customers, not MVP
* Figure out how to continue testing post-release
* Determine and document goals, constraints and priorities within a project charter
* Publish organisational core values
* Move away from tribute-style teams to product-ownership teams (and figure out what a "product" is
  at a services company. Is it a client? A client's application? A collection of similar
  applications?)
* Quality analysis, not Quality assurance
* Document and publish engineer constitution

