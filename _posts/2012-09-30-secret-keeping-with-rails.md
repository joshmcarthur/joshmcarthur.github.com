---
layout: post
title: "Secret Keeping with Rails"
description: ""
category: 
tags: []
projects:
  - name: Hashie
    url: https://github.com/intridea/hashie
    description: "Hashie provides some useful extension's to Ruby's Hash class, and is great for creating objects out of hashes."
  - name: OmniAuth
    url: https://github.com/intridea/omniauth
    description: "OmniAuth is the main Ruby OAuth library, supporting a number of 'strategies' for authenticating with lots of sites. Plus, it's really easy to use!"
---

Ever needed to store some secrets in Rails that you don't want to share with the world? Yeah, same! In this post, I'm going to outline a really simple way to store your application's secrets in a file called `config/secrets.yml`.

![Secret image](/img/posts/secret.jpg)

#### Rails configuration and you

First of all, let's discuss exactly how this is going to work. If you've even configured a Rails app before, you may have noticed that you're setting your configuration on a `config` object inside a block that looks a bit like this:

{% highlight ruby %}
MyRailsApp::Application.configure do |config|
  config.compile_assets = false
end
{% endhighlight %}

Something you might not know, though,is that these configuration settings are then available on an object called `Rails.configuration`. What we're going to do is add an initializer that loads a secrets file, and then loads them into the `Rails.configuration` object so that we can access them in our application.

The advantage of this method versus something like [Foreman](http://joshmcarthur.com/2012/08/31/process-configuration-management-with-foreman.html) is that:

1. This method is much closer to Rails conventions - for example, instead of using a dotfile, it uses a basic initializer
2. It doesn't require running your application through any special interface like Foreman does
3. It just does one thing, and does it well - storing configuration.

#### Reading the config file

As I've mentioned, we'll be reading a file called `config/secrets.yml`. Let's get our application set up to load this file. 

> NB: For this example, I'm assuming you've got a Rails 3.x application set up - you don't need any models, controllers or anything else - we can test this from a `rails console`.

First of all, add the configuration file:

{% highlight yaml %}
development:
  facebook:
    app_key: 123abc
    secret: 123abcdef
{% endhighlight %}

\- as you can see, this secrets file just contains some credentials to use with Facebook OAuth - it can contain as many keys as you like, however.

Next we need to add a gem to our `Gemfile`. This gem is called `Hashie`, and extends Ruby's `Hash` object to do some cool stuff - in our case, we can pass it a hash, and it will give us method access to our secrets - in other words, we can do this:

{% highlight ruby %}
Rails.configuration.secrets.facebook.app_key
{% endhighlight %}

Instead of:

{% highlight ruby %}
Rails.configuration.secrets['facebook']['app_key']
{% endhighlight %}

As a bonus, if you're using Omniauth and any Omniauth strategies, you've probably already installed `Hashie` as a dependency of one of these - we're just doing to re-use it here, so let's add it to our Gemfile and be specific:

{% highlight ruby %}
# Gemfile
# ...
gem 'hashie'
{% endhighlight %}

Next, let's add an initializer to load this file in `config/initializers/01_load_secrets`. The "01" part is important; it tells Rails to load it before any other initializer runs (since we might need our secrets straight away in an initializer):

{% highlight ruby %}
# config/initializers/01_load_secrets.rb
MyRailsApp::Application.configure do
  # Note: Hashie is a gem dependency
  config.secrets = Hashie::Mash.new(YAML.load_file(Rails.root.join('config', 'secrets.yml'))[Rails.env.to_s])
end 
{% endhighlight %}

I'll just talk through what this is doing:

* First, we open a configuration block for our application -  this gives us access to a `config` object we can set keys on
* Next, we load the YAML file we created, but only pull in keys for the Rails environment we are running in - this let's us have keys for `test`, `development`, etc. in a single file.
* Finally, we wrap that YAML file load in a `Hashie::Mash`. [Hashie](https://github.com/intridea/hashie) is just a collection of Hash extensions that, in this case, gives turns our Hash (which is what `YAML.load_file` returns) into an object with method access (so we can go `config.secrets.facebook.app_key`)

That's all we need to do to load the config in - as you can see, it's actually a really simple operation, and use of Hashie means that we don't need to mess up our code later down the track with lots of square brackets and hash keys.

#### Using configuration

Once we've got the file loaded, actually using the configuration is actually really easy - just access your top-secret secrets on `Rails.configuration.secrets`. 

For reference, here's how you might set [Omniauth] to support logging in with Facebook using our new `secrets.yml` file:

{% highlight ruby %}
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook,
  	Rails.configuration.secrets.facebook.app_key,
  	Rails.configuration.secrets.facebook.secret 
end
{% endhighlight %}

