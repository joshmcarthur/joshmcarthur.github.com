---
layout: post
title: "Git-browse for Quick Repo Viewing"
date: 2012-02-28 08:50
comments: true
categories:
---

Last night I quickly patched together a command called `git-browse` - it's a small but handy extension to [git](http://git-scm.com/) that looks at the remotes you have set up inside a repository, and opens up the first Github repository it finds - to give an example:

<pre>
-> git remote -v
origin git@github.com:joshmcarthur/WriteIdeally.git (fetch)
origin git@github.com:joshmcarthur/WriteIdeally.git (push)
heroku git@heroku.com:writeideally.git (fetch)
heroku git@heroku.com:writeideally.git (push)
-> git browse
(Opens https://github.com/joshmcarthur/WriteIdeally in default browser)
</pre>
l
The source is just below - at the moment, though it's only compatible with OS X and Linux - Ubuntu that I know of, but I believe that RedHat won't work without installing packages - see [this StackOverflow thread](http://stackoverflow.com/questions/5116473/linux-command-to-open-url-in-default-browser)

<script src="https://gist.github.com/1926673.js?file=git-browse"></script>

Installation is pretty basic - just download, make it executable by running `chmod +x git-browse`, and then copy it somewhere that is referenced by your `$PATH` variable (you can see what's in this variable by running `echo $PATH` in a Terminal). Once you've done this, you should be able to enter any repository with Github remotes, and run `git browse` to have the repository open in your default browser.

Extensions to this idea should be pretty easy - something I would be keen to see in a pull request, for example, would be to support opening arbitrary files - i.e. `git browse lib/writeideally/api.rb` would open [https://github.com/joshmcarthur/WriteIdeally/blob/master/lib/writeideally/api.rb](https://github.com/joshmcarthur/WriteIdeally/blob/master/lib/writeideally/api.rb). Having said that, my gsubbing is pretty gross, so that needs refactoring as well.

In any case, enjoy!
