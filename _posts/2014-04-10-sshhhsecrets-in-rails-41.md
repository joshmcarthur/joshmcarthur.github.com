---
layout: post
title: "Sshhh...Secrets in Rails 4.1"
description: ""
category: 
tags: []
---

With the [recent release of Rails 4.1](https://rubygems.org/gems/rails), has come a feature that I've really been looking forward to. That feature is automatic support for storing your application's secrets in a YAML file. 

Whenever you have a repository of code, it's a great idea to always work under the assumption that the code you write could be open-sourced at any time. Keeping this in mind helps to uphold coding standards, comment quality, and generally what goes into your codebase. 

Something I see a lot is files that have been committed with data in them that is specific to the project. Sometimes this data is an API key, or a password (this is _really_ bad), and sometime's it's just something that is configuration specific to a particular user that will make the project hard for others to use.

The [Twelve-Factor App's rules on config](http://12factor.net/config), state that:

> Apps sometimes store config as constants in the code. This is a violation of twelve-factor, which requires strict separation of config from code. Config varies substantially across deploys, code does not. 

and:

> A litmus test for whether an app has all config correctly factored out of the code is whether the codebase could be made open source at any moment, without compromising any credentials.

Obviously then, just putting keys, passwords, or environment-specific information into a repository is undesirable. 

Previous to Rails 4.1, keeping this sort of information out of the codebase required undertaking some special steps. The most common option, popularized by Heroku's implementation of config, is to store configuration in environment variables. To this end, the [dotenv](https://github.com/bkeepers/dotenv) gem was created, to centralize where these variables were stored (you could also `export` them in your shell, but this is a little more difficult to maintain). Another option was to implement your own YAML file that was read in to your application using an initializer. This option is also good for more specific settings that aren't secrets, but are configuration - for example, [my pattern for loading ActionMailer settings from a YAML file](https://gist.github.com/joshmcarthur/9884826).

The key factor here is, however secrets _used_ to be stored, almost all of the solutions suggested around the internet required using something more than just Rails. What the core team have done is to build in support for just one of these solutions, that is going to work for 90% of developers - reading a file named `config/secrets.yml`, and automatically parsing, and namespacing to your Rails environment, the data in the file.

Here's an example:

Let's say I've got a recipe-book application named 'Chef', that has the ability to log in using Facebook using Oauth via the [Omniauth gem](http://rubygems.org/gems/omniauth). In order to peform the authentication process, I need to provide Omniauth with my 'app_id', and 'app secret'. Clearly, these two values are configuration, so we want to de-couple them from the application. They're also pretty confidential, as anyone could use these two values to connect to Facebook as our application.

With support for `secrets.yml` in Rails 4.1, we can simply put these values straight into our configuration file:

{% highlight yaml %}
# config/secrets.yml
development:
  facebook_app_id: 123456
  facebook_app_secret: s3cret!!!
test:
  facebook_app_id: 1234567
  facebook_app_secret: s3cret!!!
{% endhighlight %}

and then access the values in our Omniauth setup:

{% highlight ruby %}
# config/initializers/omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, 
           Rails.application.secrets.facebook_app_id, 
           Rails.application.secrets.facebook_app_secret
end
{% endhighlight %}

By default, git will ignore and never commit the secrets file, so the file remains as a local copy only - it's considered helpful when you have a file like this to copy it, and remove all sensitive data - naming convention is to suffix the file name with '.example' - e.g. `config/secrets.yml.example` - and commit this file. This gives other developers a template to work with - they can copy the file back to `config/secrets.yml`, and fill in their own configuration.

The only thing that I've spotted missing from the implementation of the parsing of the secrets file is that while the top-level keys of the YAML file can be accessed using dot-notation (as above, where I've gone `secrets.facebook_app_id`), the file does not appear to be parsed in such a way that this dot-notation works for nested keys. I think this would be a great addition as a way to keep this file nice and tidy, if I could for example, have a YAML file that looks like this:

{% highlight yaml %}
development:
  facebook:
    app_id: 12345
    app_secret: s3cret!!
{% endhighlight %}

...and be able to access a secret using the code `Rails.application.secrets.facebook.app_id`. Hopefully support for nested keys will be coming in a later release!

Rails' support for secrets is a long time coming, and I'm really glad to see that they're making things even easier for us developers. There's a whole lot of other neat changes in 4.1, so to find our more about the new features (and some more information about the secrets support), check out the [Rails 4.1 Release Notes](http://edgeguides.rubyonrails.org/4_1_release_notes.html)!
