---
layout: post
title: "Running Gitlab CI tests with docker compose"
description: "How to run tests on Gitlab CI with a docker-compose.yml file"
category: TIL
tags: [til,technology,gitlab,ci,docker]
---

I've been working for some time to get [Pawfit](https://pawfit.nz) (my pet project, literally), continuously deploying. I've only recently added tests, so now that I have them, I want a green check each time I push.

I run just about all my Rails apps now using Docker and docker-compose, almost always
using my own [base Docker* files](https://github.com/joshmcarthur/Dockerfiles/tree/master/rails). I choose not to push these files to a repository like Docker Hub, because I don't consider them usable on their own - their intention is to provide a starting point to grow from, rather than an out-of-the-box solution.

Since this project is a small project and is running on a constrained budget (read: my own funds), I've constantly been looking for ways to optimise for cost. Along these lines, I've started pushing to Gitlab, mostly to make the most of their excellent CI product. I've been having quite a few problems getting my tests running though, as I want to use my own Dockerfile to have a consistent build - I don't want to have my Dockerfile and then a bunch of duplicated set up steps in my `.gitlab-ci.yml`. Gitlab supports Docker-in-Docker, which instantly puts it up there in terms of CI provider, but I still had a few issues. These issues were almost exclusively related to being unable to resolve linked container hostnames from my 'app' container - i.e. my 'app' container could be built and run, but could not see or communicate to port 5432 on my 'db' container.

In the end, I gave up on a pure Docker solution to CI, and went with docker-compose, which is what I use for development. Whatever problems plain Docker commands were causing me, docker-compose seemed able to overcome, and I now have my builds running nicely. A future refactoring will be to make use of Gitlab's built-in Docker image repository to keep track of app images each time I push, eventually moving to container based deployment. 

Anyway, here is the Gitlab CI YML file I ended up with:

``` yaml
test:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_DRIVER: overlay2
  before_script:
    - apk add --no-cache py-pip
    - pip install docker-compose
  script:
    - docker-compose build
    - docker-compose run -e RAILS_ENV=test app rake db:test:prepare test test:system
production:
  stage: deploy
  script:
  - gem install dpl
  - dpl --provider=heroku --app=pawfit --api-key=$HEROKU_PRODUCTION_API_KEY
  only:
  - master
```

What this does:

1. Defines a test job, and production job. I can disregard the production job, as it just exists to auto-deploy my app to Heroku.
2. The test job uses the latest Docker as a base image, and tells Gitlab to use it's "Docker-in-Docker" service (docker:dind). This sets up appropriate services and environment variables to be able to use Docker from within their Docker-based job runners.
3. Sets overlay2 as the Docker driver. I'm told this is faster, your job should work without this.
4. Before the job script runs, docker-compose is installed using `pip`.
5. The script runs - this builds the image, then runs preparation for the tests, the unit tests, and the system tests (using headless Chrome).



