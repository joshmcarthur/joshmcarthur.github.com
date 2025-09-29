---
title: How to test new Github Actions workflows
category: TIL
---

I recently build out a data processing pipeline that uses Github Actions, and so
needed to add several new workflows. I couldn't for the life of me figure out
how to test them. They were going to be initiated either as part of a pipeline
(using `workflow_call`), or manually, using `workflow_dispatch`. In most cases,
each workflow had inputs which needed to be provided.

Github Actions shows workflows that can be called, but only once they're on
`main`. I didn't really want to sit here committing directly to `main` until
they worked the way I needed, so I came up with this flow which works well:

1. Create the workflow files you need. Make sure they have the
   `workflow_dispatch` trigger _at least_ so they can be invoked
2. Put a minimal job into the workflow file - it doesn't matter what the job
   does, it just needs to be syntactically valid
3. Via a pull request, add these new workflows to `main`- noting that they are
   basically no-op workflows at the moment
4. Now that the workflows are on `main`, they are available to be dispatched
   from the Github Actions UI, _and_ you can now choose which branch to run the
   workflow from.
5. Modify your workflow on a branch, committing as necessary and invoking the
   workflow from that branch.
6. Once you have the workflow working the way you expect, you can open a pull
   request to add the 'implementation' of the workflow back to 'main'.

This pattern still requires a pull request onto main, but only with no-op,
'empty' workflows. Once they are on `main`, they can be actually implemented and
tested in a feature branch before merging the implementation back to `main`.
