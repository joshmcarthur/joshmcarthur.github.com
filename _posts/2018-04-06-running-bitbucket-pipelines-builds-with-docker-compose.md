---
layout: post
title: "Running Bitbucket Pipelines builds with docker compose"
description: "How to use Bitbucket Pipelines to run builds using docker-compose"
category: TIL
tags: [til,bitbucket,ci]
---

As a companion to [my post describing how to run tests with docker-compose on Gitlab CI], I converted the build steps this morning to work with [Bitbucket Pipelines](https://bitbucket.org/product/features/pipelines).

Here's the adapted `bitbucket-pipelines.yml` file:

``` yaml
image: docker:stable

pipelines:
  default:
    - step:
        services:
          - docker
        script: 
          - apk add --no-cache py-pip bash 
          - pip install --no-cache-dir docker-compose
          - docker-compose -v
          - docker-compose run -e RAILS_ENV=test app bin/ci-setup
          - docker-compose run -e RAILS_ENV=test app bin/ci-run
```

Only minor differences from the Gitlab CI, mostly relating to the base image being used:

1. `docker:stable` is used as the base image. This is a nice small image for running DinD (Docker-in-Docker), and is (unsuprisingly) based on the latest stable release of Docker.
2. We declare that we need `docker` to be running for this build.
3. Our script installs docker-compose using `pip`, and then runs the CI commands. 

There is a small performance penalty for this method, since `docker-compose` needs to build an image from scratch each time (unless your `docker-compose.yml` declares a complete image rather than a build instruction), however I've found this time to be comparable to running in a traditional, non-Docker CI environment. 


