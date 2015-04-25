---
layout: post
title: "Simple Ember CLI deploys"
description: ""
category:
tags: []
---

> Note: I can't vouch as to the best-practise compliance of this technique, but it's worked well for me.

One of the neat things about using a Javascript framework such as Ember.js is that you can host it just about
anywhere you like - it's just static files after all. My first stop for hosting things like this is [Github Pages](https://pages.github.com) - it means the site is backed by Git (as it should be anyway), and your files are being served by Github's [pretty solid](https://status.github.com) platform.

If you've got a Github Pages site though, generally you are deploying to a branch named `gh-pages`. The files you push to the `gh-pages` branch should also be the files you would normally place at the root location of your web server (i.e. there should be a file named `index.html` that will be served by default. This becomes a bit tricky with git, as you need the files contained in one particular folder of your repository to be pushed to a different branch than the one your on.

Based on a bit of research, I found that Git has a way of doing this, and it's a pretty neat technique. The subcommand is called `subtree push`, and it basically let's you push a particular folder of your repository to a remote branch. In the context of Ember (Ember CLI in particular), this means pushing your `dist` folder to the `gh-pages` branch, or:

``` bash
git subtree push --prefix dist origin gh-pages
```

It's not quite as simple as that though! Applications generated with ember-cli (quite rightly in _most_ cases), add the `dist` folder to the `.gitignore` file, which will cause that subtree command to ignore files in that directory when pushing (i.e. it appears to succeed, but nothing is pushed). I haven't yet found a good solution for this, so for now I've just stopped ignoring the dist folder. This invovles checking in changes every time I build, however it seems to be necessary for this deploy process to work.

My workflow for making changes to an Ember CLI application now then is:

* Make the changes
* Run the tests (if any, this is an area of Ember I need to catch up on)
* Run `ember build production` to update the contents of the `dist` folder
* Run `git subtree push --prefix dist origin gh-pages`

Most of the time, I'll put those last two commands into a shell script I can invoke, and call that `deploy.sh` - but then - that's it, that's my deploy process. My changes go up in a couple of seconds and are live straight away. I can then check in my changes to `master` as I normally would, and `master` will continue to include a full copy of the Ember application that anyone can clone and hack away on.

#### Tips, Tricks and Notes

1. If you've got any files that you just want to go into the `dist` folder, put them in the `public` folder of your Ember CLI application. A perfect use case for this is the `CNAME` file that Github requires be in your `gh-pages` branch if you wish to direct a custom domain name to your Github Pages site.
2. If you are not using a custom domain, and you're pushing to a project repository, then your Github pages site will be available at: `https://[github username].github.io/[your repository name]`. In order to get your assets, etc. loading correctly (because the site is in a subfolder), you need to add the following to your `config/environment.js`:
    {%highlight javascript%}
      if (environment === 'production') {
        ENV.baseURL = '/name-of-your-repo'
      }
    {%endhighlight%}
3. If you would prefer a more integrated approach, you might be interested in the [ember-cli-github-pages](https://github.com/poetic/ember-cli-github-pages) addon for Ember CLI. Personally, it's not for me, as I prefer to put together my own git commands - I'm not so sure it's an Ember addon should be taking care of the whole deployment like that.


