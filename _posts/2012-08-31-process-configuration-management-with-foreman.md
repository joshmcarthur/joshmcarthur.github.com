---
layout: post
title: "Process configuration management with Foreman"
description: ""
category: 
tags: []
---

---

> **Information:**
> This blog post is based on a lightning talk I delivered
> at [3months](http://3months.com) for the dev team. 3months is an agile-based company based in Wellinton, New Zealand. We have fun. Interested in working for us? [Give us a shout!](http://www.3months.com/working-for-us/)

---

Often in the Rails projects I build, I have a need to store configuration that I don't really want to have in my code. The most obvious way to do this is to either store the configuration in a YAML file (e.g. `config/settings.yml`), or in environment variables.

[Foreman](http://rubygems.org/gems/foreman) is [Heroku](http://heroku.com)'s answer to these types of configuration challenges. It is used internally at Heroku to manage processes and their configuration.

## Managing Configuration

If you've ever worked with Heroku, you've probably seen the `heroku config` command. When you run this command on an active Heroku project, you see output like this:

{% highlight bash %}
=== latter Config Vars
DATABASE_URL:                 postgres://xxxxxxxxx:5432/db
GEM_PATH:                     vendor/bundle/ruby/1.9.1
HEROKU_POSTGRESQL_PURPLE_URL: postgres://xxxxxxxxx:5432/db
PGBACKUPS_URL:                https://backups.heroku.com/client
RACK_ENV:                     production
RAILS_ENV:                    production
SHARED_DATABASE_URL:          postgres://xxxxxxx
{% endhighlight %}

This configuration is actually managed by Foreman, and is stored in a file called '.env' in the root of the project. The .env file for the configuration above would look like this:

{% highlight bash %}
DATABASE_URL=postgres://xxxxxxxxx:5432/d3o4ndc7b0g39o
GEM_PATH=vendor/bundle/ruby/1.9.1
HEROKU_POSTGRESQL_PURPLE_URL=postgres://xxxxxxxxx:5432/db
LANG=en_US.UTF-8
PGBACKUPS_URL=https://backups.heroku.com/client
RACK_ENV=production
RAILS_ENV=production
SHARED_DATABASE_URL=postgres://xxxxxxx
{% endhighlight %}

The cool thing about Foreman is that you can use this .env file just as easily locally. All it does is reads the file when you run a command, and loads these variables into your shell as environment variables. 

## Managing Processes

The other functionality that Foreman provides is the ability to run and manage multiple processes. This is something that you may or may not have run into in Heroku, but it's still pretty cool. Without foreman, if you had a Rails server, a PubSub server ([Faye](http://faye.jcoglan.com/), for example), and a daemon to run, you might have to do the following:

1. New terminal tab, run `bundle exec rails s`
2. New terminal tab, run `bundle exec rackup faye.ru`
3. New terminal tab, run `bundle exec script/daemon start`

…and then you need to keep an eye on each of these tabs.

With Foreman, you create a file called a `Procfile`. This stands for 'Process file', and is a simple listing of the processes you would like to run. For example, [on-the-spot](https://github.com/joshmcarthur/on-the-spot)'s `Procfile` looks like this:

{% highlight ruby %}
web: bundle exec rails s 
pubsub: bundle exec rackup ./private_pub.ru -s thin -E production
daemon: bundle exec ./lib/daemons/spotify_controller_ctl run
{% endhighlight %}

When you run `foreman start`, Foreman will boot up each of these processes, and output the combined logs for all in the window. When you stop Foreman (By hitting Ctrl-C), it will shutdown each of the processes before exiting. This process is much easier to handle than multiple terminal tabs.

## Installing Foreman

There's two ways to install Foreman:

1. **Via the Heroku Toolbelt.** Heroku publishes a 'Toolbelt' - a collection of tools required to develop applications that run on the Heroku platform. I don't use this method myself, as I prefer to have control over what's installed and where, but you can install this from `https://toolbelt.heroku.com/` if you'd like
2. **As a gem.** You can just run `gem install foreman` to get it installed - easy as that. If you're using RVM, then you may want to follow my pattern - I normally place foreman in my global gemset along with the `heroku` gem, so that it accessible to all my apps. If you're just experimenting with Foreman though, you may want to place it in it's own gemset.

## Using Foreman

Foreman is actually pretty easy to use on a day-to-day basis - there's really only two commands you need to run:

* `foreman run [cmd]` - You can run any command with foreman, doing all the environment variable setup, etc. beforehand. If you _require_ any variables in your application's setup routine, then you will need to run all your `rails *` and `rake *` commands with this, otherwise you can just run it when you need access to these variables.
* `foreman start` - Use this command to start all the processes listed in your `Procfile`, and just `Ctrl-C` when you want to stop them. 

Easy as that really. There's a bunch of other things you can do with foreman (such as exporting launchd and init.d scripts to run your application automatically), but they're not really something you'll need to know to get started.


## Debugging Ruby with Foreman

A common complaint I hear about foreman is that it's quite complex to debug application's in. This is a consequence of the way that foreman combines the running of all of the processes in your Procfile into a single output flow - debugger's can't easily make it through. I've found there's a couple of ways to debug with Foreman though:

1. **Run a Rails debugging server with `foreman run`.** Since `foreman run` doesn't do any of the fancy `Procfile` stuff, you can just run `foreman run rails s --debugger` when you _do_ need to debug - it will behave just as it always has.
2. **Use a debugging console directly in foreman.** I've had mixed results with this, but if you do run with `foreman start` and have debuggers in your code, I have noticed that these breakpoints do get hit - it's just that foreman doesn't always output the prompt characters for the debugger. You can still type in `irb` to drop into an IRB session, and everything will behave as it usually does from here - it just requires a keen eye to spot when you've landed on a debugger in foreman (since there won't be any output)
3. **Run a remote instance of ruby-debug and connect that way.** Ruby's debugging support includes the ability to run a debugging server from your application, that you can connect to from another terminal window or tab. To do this, you need to do a bit of setup in an initializer, but once it's there, it's pretty seamless:
 * In `config/environments/development.rb`, add the following lines:
  {% highlight ruby %}
    # Wait for remote connections from rdebug
    Debugger.wait_connection = true
    
    # Listen for remote connections
	Debugger.start_remote
{% endhighlight %}
* In a new terminal window or tab, run the `rdebug` program to connect to your remote debugging instance: 
 	{% highlight bash %}
 	rdebug -c
 	{% endhighlight %}
* (More info [on this Github issue](https://github.com/ddollar/foreman/issues/58))
 	

I do prefer the first two options to the last, as I find that code changes seem unnecessary for this, and I normally aren't needing to debug all the time. Largely though, this is up to personal preference, and I wanted to present all options.

## Conclusion

Foreman is a pretty awesome tool for development, especially for those apps that may have some complex configuration and process management needs. I don't use it for all my applications (since I'm a strong believer in picking **just enough** of the right tools for the job), but I do find it incredibly handy to extract all my configuration and processes into external files that I can easily update and generally DRY up my code.




