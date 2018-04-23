---
layout: post
title: "TIL: Cherry picking without a commit"
description: "TIL how to cherry-pick one or multiple commits while being given the chance to revise the commit message."
category: TIL
tags: [til,technology,git]
---

Cherry-picking git commits isn't part of my day-to-day workflow, but 
I do need to do it occasionally. Generally, and in the case I ran into today, I had a range of commits that required cherry-picking from `master` onto a long-lived feature branch. 

Normally cherry-picking in git will take each commit and "copy" it onto the current branch. This is generally fine, but in the case where you might be cherry-picking a larger range of commits, or you find that the message against the commit being cherry-picked isn't adequately descriptive of the commit in the context of the branch, the `-n` flag can come in handy.

The `-n` flag is described in the manual:

> -n, --no-commit
>           Usually the command automatically creates a sequence of commits. This flag applies the changes
>           necessary to cherry-pick each named commit to your working tree and the index, without making any
>           commit.

In other words, using `git cherry-pick -n` will cherry-pick a commit across into the branch, _without committing_. This allows for the changes to be committed differently - maybe you want to 'squash' all of the changes into a single commit, or rephrase one or more of the commit messages - all of this is quite simple with a no commit cherry-pick, since while the changes are applied by git, none of the changes are recorded as actual commits - how the committing is done is entirely up to you.