---
title: Building resilient personal apps
---

I've written before about [passion projects](/posts/2024/05/27/Passion-projects.html)
and how taking care of them feels more like tending a garden than running a
product. Mowing the lawn, weeding, the occasional prune. The metaphor still
holds, but I've started thinking more concretely about what "resilient" means
for the apps I actually use every day.

For me, it's not about uptime SLAs or on-call rotations. It's about being able
to leave a project alone for a few weeks, come back, apply a security patch
without dread, and know exactly what version is running on the box under my
desk. [Aotearoa, Again](https://github.com/joshmcarthur/aotearoa-again) is the
project where I've been experimenting with this — a daily publishing app I want
to still be happy running in a year, without maintenance becoming a project in its
own right. (There's a [case study](/case-studies/aotearoa-again/) if you want the
product side; this post is about the plumbing.)

## What I'm optimising for

The bar I set is pretty modest. The app should stay patched, keep passing its
tests, and produce a tagged artefact I can deploy without guessing. Everything
else — feature work, major version bumps, whether to adopt the shiny new thing —
stays manual, because that's the part I actually enjoy.

I don't think this is a framework for everyone. It's just how I've arranged
things so the chores sort themselves out while I get on with the interesting
bits.

## Letting Dependabot do the weeding

The first piece is boring: [Dependabot](https://docs.github.com/en/code-security/dependabot)
opens PRs when gems or GitHub Actions get updates. I run it weekly for both
`bundler` and `github-actions`, with a cap of ten open PRs so the queue doesn't
get out of hand:

```yaml
# .github/dependabot.yml
version: 2
updates:
- package-ecosystem: bundler
  directory: "/"
  schedule:
    interval: weekly
  open-pull-requests-limit: 10
- package-ecosystem: github-actions
  directory: "/"
  schedule:
    interval: weekly
  open-pull-requests-limit: 10
```

That's it. Dependabot does the scanning; I don't have to remember to check for
patch releases.

## CI before anything merges automatically

Auto-merging dependency PRs only makes sense if CI actually tells you something.
My workflow runs security scans (Brakeman, bundler-audit, importmap audit),
RuboCop, unit tests, and system tests on every pull request. It's the same
pipeline whether the PR is from me or from Dependabot.

I'm not claiming this is exhaustive — it's what I need for confidence on this
particular app. A publishing pipeline with image composition and background jobs
benefits from system tests in a way a static site probably wouldn't.

## Auto-merge, but only for patches

Here's where I've drawn a line. Dependabot PRs that pass CI and are
**patch-level** semver updates get merged automatically. Minor and major bumps
stay open until I've looked at them.

The job lives at the bottom of `ci.yml` and waits for every other job to finish
first:

```yaml
dependabot_auto_merge:
  name: Dependabot auto-merge
  needs: [scan_ruby, scan_js, lint, test, system-test]
  runs-on: ubuntu-latest
  if: github.event_name == 'pull_request' && github.actor == 'dependabot[bot]'
  permissions:
    contents: write
    pull-requests: write
  steps:
    - name: Dependabot metadata
      id: metadata
      uses: dependabot/fetch-metadata@v3
      with:
        github-token: "${{ secrets.GITHUB_TOKEN }}"

    - name: Merge patch updates
      if: steps.metadata.outputs.update-type == 'version-update:semver-patch'
      run: gh pr merge --squash --delete-branch "$PR_URL"
      env:
        PR_URL: ${{ github.event.pull_request.html_url }}
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Squash merge keeps `main` readable; deleting the branch avoids clutter. The
patch-only guard is the important bit — I'd rather review a Rails minor bump
myself than discover a subtle breaking change on a Tuesday morning when the
daily edition is due to publish.

## Releases without the ceremony

Tagged versions are the other half of resilience for me. When something goes
wrong in production, I want to answer "what changed?" without spelunking through
squashed commits.

I use [release-please](https://github.com/googleapis/release-please) for this.
Commits on `main` follow [Conventional Commits](https://www.conventionalcommits.org/)
(`feat:`, `fix:`, and so on). On each push, release-please either opens or
updates a release PR with a version bump and changelog entry. Merging that PR
creates a GitHub Release and a git tag — `v0.20.4` at the time of writing.

The config is small. I hide chore/ci/docs sections from the public changelog
because nobody needs to read about my RuboCop cache tweaks:

```json
{
  "packages": {
    ".": {
      "release-type": "simple",
      "changelog-sections": [
        { "type": "feat", "section": "Features" },
        { "type": "fix", "section": "Bug Fixes" },
        { "type": "chore", "section": "Miscellaneous Chores", "hidden": true },
        { "type": "ci", "section": "Continuous Integration", "hidden": true }
      ]
    }
  }
}
```

I won't pretend I never forget the conventional commit prefix. When I do,
release-please just doesn't pick it up for the next release, and I fix it on the
next commit. Imperfect, but good enough.

## Tagged Docker images for the home host

Aotearoa, Again runs at home behind a Cloudflare Tunnel. I deploy it as a
Docker image from GitHub Container Registry, pinned to a specific version:

```bash
docker pull ghcr.io/joshmcarthur/aotearoa-again:0.20.4
docker run -d \
  --name aotearoa-again \
  -p 127.0.0.1:3000:80 \
  -e RAILS_MASTER_KEY=<production.key> \
  -v aotearoa_again_storage:/rails/storage \
  ghcr.io/joshmcarthur/aotearoa-again:0.20.4
```

The image is built by a `docker-publish` workflow that triggers when a GitHub
Release is published. It tags the image with the semver version, `latest`, and
the usual major/minor aliases.

One wrinkle worth knowing about: releases created by `GITHUB_TOKEN` (which is
what release-please uses) don't fire `release` events for other workflows. So
my release-please workflow explicitly dispatches the Docker publish after
creating a release:

```yaml
- name: Dispatch Docker publish
  if: ${{ steps.release.outputs.release_created }}
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    gh workflow run docker-publish.yml \
      --repo "${{ github.repository }}" \
      --ref "${{ steps.release.outputs.tag_name }}" \
      -f tag="${{ steps.release.outputs.version }}"
```

I spent longer than I'd like to admit wondering why my Docker workflow never ran
after the first few releases. This is the fix.

## What I still do by hand

Automation has limits, and I'm fine with that. Major dependency upgrades,
new features, production credentials, and the editorial review before each
day's photo goes live — all manual. The automation handles the parts I'd
otherwise procrastinate on: patch bumps, changelog hygiene, and knowing which
image tag is on the host.

If you're curious about the full setup, the workflows and deploy docs are in the
[repo](https://github.com/joshmcarthur/aotearoa-again). It's not a template —
just one way I've found to keep a personal app running without it taking over
my weekends.
