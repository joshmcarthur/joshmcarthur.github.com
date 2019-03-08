---
layout: post
title: "create-react-app Gitlab Page template"
description: "Simple Gitlab-CI template for building a create-react-app application for Gitlab Pages"
category: TIL
tags: [til,technology]
---

I regularly complete little side projects in React - normally convenience shortcuts or data visualisation projects.
My preferrred deployment platform for such static sites is Gitlab Pages, as it allows for flexible builds, and I can use custom SSL certificates so that I don't need to terminate my SSL with Cloudflare.

Here is the template I use to build my React apps for Gitlab:

``` yaml
image: node:lts

pages:
  stage: deploy
  before_script:
  - npm install -g yarn
  - yarn install
  script:
  - yarn build
  - mv public public.old
  - mv build public
  artifacts:
    paths:
    - public
  only:
  - master
```

It:

1. Uses the latest LTS node image
2. Installs yarn, and then crete-react-app's dependencies
3. Builds a production release of the create-react-app application (`yarn build`)
4. Copies the old public folder out of the way, and then copies the 'build' folder produced by the create-react-app build step to 'public'. This is necessary because Gitlab pages will only serve files from the 'public' folder.
5. Restrict this deployment to run only on pushes to the master branch. This lets me work on features, merge requests, and bugfixes in the relevant branches before merging to `master` to release.
