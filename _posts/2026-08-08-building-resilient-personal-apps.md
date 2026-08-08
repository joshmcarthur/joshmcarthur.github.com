---
title: Building resilient personal apps
---

I've written before about [passion projects](/posts/2024/05/27/Passion-projects.html)
and how taking care of them feels more like tending a garden than running a
product. Mowing the lawn and weeding, with the occasional prune. That metaphor
still feels right to me, but I've started thinking more concretely about what
happens when a project reaches the point where I actually use it most days, and
what "resilient" means in that situation. Mostly, it means the codebase stays
current without me having to think about it every week. I want to be able to
leave a project alone for a few weeks, come back to it, and find it in roughly
the same shape I left it. The patches have been applied. The tests are still
green. I know which version is running on the box under my desk. [Aotearoa, Again](https://github.com/joshmcarthur/aotearoa-again) is the
project where I've been experimenting with this lately: a daily publishing app I
want to still be happy running in a year, without maintenance becoming a project
in its own right. There's a [case study](/case-studies/aotearoa-again/) on the
product side if you're curious. This post is mostly about the gardening.

I've found that certain kinds of work on a personal app are really easy to put
off. They're low-risk when done carefully, but important enough that
procrastinating on them eventually bites you. Those are the things I try to
automate. What I keep manual is the part I actually enjoy: building features,
reviewing major upgrades, and signing off on each day's photo before it goes
live.

I don't want to remember to check for gem or GitHub Actions updates, so
Dependabot opens PRs on a weekly schedule for both, with a cap on how many can
pile up at once. Patch-level updates that pass CI get merged automatically.
Minor and major bumps wait for me. I've drawn that line deliberately: patches
feel like mowing the lawn, majors feel like deciding to replant a whole bed.

Auto-merge is only as good as the checks in front of it. Whether the PR is from
me or from Dependabot, the same pipeline runs first: security scans, then
linting, then unit and system tests. It's not exhaustive, but it's enough that a
green build means I can stop worrying about that particular change. A publishing
pipeline with image composition and background jobs probably needs more
confidence than a static site would. That's a judgement call for each project.

When something does go wrong, I want to be able to answer "what changed?"
without spelunking through squashed commits. I use release-please to turn
conventional commit messages into version bumps and changelogs and git tags.
Merging the release PR cuts a GitHub Release. A follow-on workflow builds a
Docker image tagged with that version. On the home host I pull a specific tag
(`0.20.4`, not `latest`) so I always know what's deployed. The [workflows are
in the repo](https://github.com/joshmcarthur/aotearoa-again/tree/main/.github)
if you want to see how it's wired up, but the point isn't really the YAML. Each
of these things maps to a chore I'd otherwise skip, and the automation is narrow
enough that I trust it.

That said, automation has limits, and I'm fine with that. Major dependency
upgrades I still do myself. Same for new features and production credentials.
I'd rather review a Rails minor bump myself than discover a subtle breaking
change on a Tuesday morning when the daily edition is due to publish. The goal isn't a
hands-off app. It's an app that handles the boring continuity work so that when
I do sit down to work on it, I'm pruning or planting, not mowing.

The setup above works well for the mechanical stuff like patches and tagged
releases and pinned images. But there's another layer of gardening I've been
pondering: the small tidy-ups you
notice and then don't get around to. A deprecation warning that's been sitting
in the logs for a month. A test that's a bit flaky but not quite broken. A
dependency that's technically current but sitting on an older major. Low-stakes
one at a time, important in aggregate, and tedious to context-switch into.

I'm wondering whether agents might be a good fit for that sort of work. Not
replacing judgement on features or production changes, but handling the "I
noticed this rough patch and here's a PR" stuff while I'm away, with CI as a
safety net. I'm not there yet, but it's the next iteration I'm curious about.

For now, Dependabot and a conservative auto-merge policy are enough to mean I
can come back to a project and trust it's been looked after. That's really all
I'm optimising for.
