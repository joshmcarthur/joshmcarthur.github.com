---
title: "Bikeshed #470: All about Queues"
---

I listened to https://bikeshed.thoughtbot.com/470 in the weekend. There was a
fair amount of talking about judoscale, but there was also some interesting
stuff in there about measuring queue performance. A couple of key takeaways for
me:

- It seemed like a really good suggestion to me was to name queues by their SLA,
  rather than their purpose - for example, instead of naming queues “emails”,
  “exports”, “push_notifications” or whatever, go with when messages should be
  handled within - Adam suggested starting with “5 seconds”, “5 minutes” and “5
  hours”.
- Having queues named for SLA gives you a really good metric for monitoring -
  messages shouldn’t sit in any of those queues for longer than the time they’re
  named for.
- If you have the infra for it (e.g. Heroku was mentioned), you don’t have to
  handle all queues with the same infra - an example they gave was that if you
  have a big expensive job that takes loads of resources (memory) - put that job
  on it’s own queue and then you can have a dedicated dyno or instance or
  whatever that only works on jobs in that queue and is otherwise idle. The idea
  being not to waste your expensive compute on trivial jobs
