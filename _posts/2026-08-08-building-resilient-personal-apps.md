---
title: Building resilient personal apps
---

I've written before about [passion projects](/posts/2024/05/27/Passion-projects.html)
and how taking care of them feels more like tending a garden than running a
product. Mowing the lawn, weeding, the occasional prune. The metaphor still
holds, but I've started thinking more concretely about what "resilient" means
for the apps I actually use every day.

For me, it's not about uptime SLAs or on-call rotations. It's about trust — the
confidence that I can leave a project alone for a few weeks, come back, and find
it in roughly the same shape I left it. Patches applied, tests still green, a
known version running on the box under my desk. [Aotearoa, Again](https://github.com/joshmcarthur/aotearoa-again)
is where I've been experimenting with this: a daily publishing app I want to still
be happy running in a year, without maintenance becoming a project in its own
right. (There's a [case study](/case-studies/aotearoa-again/) on the product
side; this is about the gardening.)

## What I automate, and what I don't

I don't have a grand theory here. I've just noticed that certain kinds of work
on a personal app are easy to put off, low-risk when done carefully, and
important enough that procrastinating on them eventually bites you. Those are the
things I try to automate. Everything else — features, major upgrades, editorial
judgement — I keep manual, because that's the part I actually enjoy.

Roughly, the categories look like this:

**Keeping dependencies current.** I don't want to remember to check for gem or
GitHub Actions updates. Dependabot opens PRs on a weekly schedule for both, with
a cap on how many can pile up at once. Patch-level updates that pass CI get
merged automatically; minor and major bumps wait for me. The line is deliberate:
patches are the mowing, majors are deciding to replant a bed.

**Verifying that nothing obvious broke.** Auto-merge is only as good as the
checks in front of it. Before anything lands — whether it's from me or from
Dependabot — the same pipeline runs: security scans, linting, unit tests, system
tests. It's not exhaustive, but it's enough that a green build means I can stop
worrying about that particular change.

**Knowing what version is running.** When something does go wrong, I want to
answer "what changed?" without spelunking through squashed commits. I use
release-please to turn conventional commit messages into version bumps,
changelogs, and git tags. Merging the release PR cuts a GitHub Release; a
follow-on workflow builds a Docker image tagged with that version. On the home
host I pull a specific tag — `0.20.4`, not `latest` — so I always know what's
deployed.

That's the shape of it. The [workflows are in the repo](https://github.com/joshmcarthur/aotearoa-again/tree/main/.github)
if you want to see how it's wired up, but the point isn't the YAML. It's that
each category maps to a chore I'd otherwise skip, and the automation is narrow
enough that I trust it.

## What stays manual

Automation has limits, and I'm fine with that. Major dependency upgrades, new
features, production credentials, and the editorial review before each day's
photo goes live — all manual. I'd rather review a Rails minor bump myself than
discover a subtle breaking change on a Tuesday morning when the daily edition is
due to publish.

The goal isn't a hands-off app. It's an app that handles the boring continuity
work so that when I do sit down to work on it, I'm pruning or planting, not
mowing.

## What I'm thinking about next

The setup above works well for the mechanical stuff — patches, tags, images.
But there's another layer of gardening I've been pondering: the small tidy-ups
you notice and then don't get around to. A deprecation warning that's been
sitting in the logs for a month. A test that's a bit flaky but not quite
broken. A dependency that's technically current but on an older major.

These are low-stakes individually and important in aggregate. They're also the
kind of thing that's tedious to context-switch into but perfectly suited to an
agent working in a branch with CI as a safety net. I'm not there yet, but it's
the next iteration I'm curious about — not replacing judgement on features or
production changes, but letting something else handle the "I noticed this rough
patch and here's a PR" work while I'm away.

If that pans out, the garden might mostly take care of itself between visits.
For now, Dependabot and a conservative auto-merge policy are enough to mean I
can come back to a project and trust it's been looked after.
