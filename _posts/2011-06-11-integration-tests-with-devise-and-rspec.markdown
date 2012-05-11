---
title: Integration tests with Devise and RSpec
layout: post

type: regular
comments: true
---

RSpec 2 has supported integration tests for a while now, and I've chosen to use
these for a project I'm working on at the moment instead of Cucumber (I don't
feel that I need the verbosity andÂ English-like structure Cucumber provides
given that it a more complex process to write tests).
A bit of a problem I've come across recently is how to get a Devise user signed
in to your application in your tests, given that integration tests don't really
give you any access to either the session or the controller (This rules out
manually setting ID's in the session, or stubbing out current_user. As it turns
out, the implementation of it is pretty simple, but I did have to do a bit of
browsing and piece a few bits together to work out a nice way of doing it.
Here is the code you can use (You would normally place this within a before(:
each) filter in your routes spec (Which is what an integration test in RSpec is
called):
[At top of spec file, after require 'spec_helper'
include Warden::Test::Helpers
[In a before(:each) block]
@user = Factory.create(:user)
@user.confirm!
login_as @user, :scope => :user
Now, what is this doing? Well, first of all, you include some test helpers that
Warden (Which devise back-ends onto), provides. I tried out using Devise's
Devise::TestHelpers here, but it looks like Devise haven't really designed
their helpers with integration tests in mind - they didn't really work.Â 
Within our before(:each) block, it now gets pretty simple. We create a User,
using Factory Girl (This part of the implementation doesn't really matter, you
can use fixtures if you prefer, or even a plain old User.create.
Next, we confirm the user. This isn't necessary if your users haven't been
marked as :confirmable in your User model, but obviously our new user needs to
be confirmed and active in order to log in.
Last of all, we use a helper method Warden's test helpers has provided us to
log in the user, which sets us up for any more requests we need to make.
Have fun speccing nicely with Devise/Warden and RSpec!

