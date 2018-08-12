---
layout: post
title: "Certbot renewals with Route53"
description: "How to install the Route53 DNS plugin to renew certificates with cerbot"
category: TIL
tags: [til, technology, ops]
---

This is a bit of documentation for the next time I run into this problem, however you
might find it useful.

The `certbot` and `certbot-auto` commands support plugins, but do not come with many out of the
box. The installation method for plugins (certbot being written in Python), is `pip`, however
certbot may or may not pick up plugins installed in this manner, depending on the environment.

I had certbot installed in Mac OS for example, and it could not find the certbot-dns-route53 package
I installed with `pip`. The [documentation](https://certbot.eff.org/docs/using.html#dns-plugins) suggests
that if you run into problems installing plugins, to run with Docker - however no such instructions for _how_
to install these plugins in the official Docker images are included - [An issue has been raised on github](https://github.com/certbot/certbot/issues/4875).

I do prefer to run commands that have dependencies like these in Docker anyway, so these are the steps I followed
to address my specific problem. Note that at one point, I do hit this problem with rather a large hammer (mounting my entire `/Users` directory as a volume) - if this upsets you, feel free to find another path forward.

First, my environment:

1. I have all of my projects in my home directory, namespaced by repository host, user or organisation name, then the repo name. In this case, I was renewing the cert for the [Pawfit Blog](https://blog.pawfit.nz), so my code repository was located in: /Users/josh/Projects/gitlab.com/joshmcarthur/pawfit-blog.
2. I keep the letsencrypt file tree in this repo under "certs", with things like private keys ignored (the repo is private but still). This just makes it easier to do renewals and see waht I did last time to fix certs). This file tree is what you would normally find under "/etc/letsencrypt". 
3. I have valid AWS credentials set up in my Mac OS home directory, inside the default ".aws" folder.
4. I have an expiring certificate inside the aforementioned "certs" directory.

How I renewed the certificate:

* Start the docker container: `docker run --rm -it --entrypoint=sh -v /Users/josh:/Users/josh certbot/cerbot`. This opens a shell
  session inside the container. The `/Users/josh` volume mount was required because certbot sets up relative symlinks
  from the "live" certificate files to the "archive" folder. When Docker mounts the volume, these seem to be converted
  to absolute symlinks. 
* Install the Route53 plugin: `pip install certbot-dns-route53`. This _should_ work outside of docker, but may not
  depending on how you have Python, Pip, and certbot installed (i.e. it didn't work for me).
* Symlink the AWS credentials folder from your host environment into the container's home directory - this is so boto3
  (which certbot-dns-route53 uses to connect to AWS) can resolve your AWS access keys. There are also a number of other
  ways you can provide boto3 with AWS credentials, such as environment variables.
* Change directory to the project directory: `cd
  /Users/josh/Projects/gitlab.com/joshmcarthur/pawfit-blog". See above for information about where I put code and
  certs, as this might be different for you.
* Run certbot! `certbot renew --config-dir=certs --work-dir=certs`
* You can now exit the container if you would like (by typing `exit`), or use `cat` to extract the information you need
  from the new certs. I exited at this point, as I wanted to use the Mac OS-native `pbcopy` command to pipe the output
  of `cat` to (e.g. `cat certs/live/blog.pawfit.nz/fullchain.pem | pbcopy`). 

