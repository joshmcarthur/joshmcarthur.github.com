---
title: Rails HABTM relationships on a non-standard connection
layout: post
tags:
  - rails
  - active_record
  - habtm
  - hints

type: regular
comments: true
---

Recently, I've been implementing an admin interface for a system that I want to
make more secure than the main application. The way I've chosen to do this is
to run some models that relate solely to the admin application (Authentication
and Authorization in particular), on a different database - let's call it
'login'. This seems to be a reasonably common thing to do for security
purposes, and also for things like moving data from one database to another.
Once again though, I've been tempted into the potential nest of bugs that is
has_and_belongs_to_many - let me explain the schema first though: *
Administrators table - holds email, encrypted passwords and other data about
administrators * Roles table - holds the name of the role - used to authorizing
an administrator when performing an action. Each of these tables uses the line
`establish_connection 'login'` to connect to a different database than the
other models - this is the secure database that I want to leave purely for the
administrative application. So, given that I had an administrator that should
be given multiple roles, and obviously each role could have many
administrators, has_and_belongs_to_many seemed the obvious candidate - I didn't
really want a model just for the association, and I would just need to write a
migration to create the join table. So, off, I went, and here's what happened:
` ERROR: relation "administrators_roles" does not exist` i.e. - the
Administrator table exists, and the Role table exists, but the join table just
isn't there. The first call for me was to take a look in the database, and make
sure that the table was there - which it was - and that migrations had
definitely run correctly and the schema was correct - which they were. After
much frustration, I found [this thread](http://groups.google.com/group/
rubyonrails-talk/browse_thread/thread/7644d9e5f5c6e44a/
69c8cce4c39eb571?show_docid=69c8cce4c39eb571) which described the problems I
had been having - and I was vaguely satisfied to see that the problem wasn't
really my fault. It seems that in some versions of Rails, ActiveRecord's
has_and_belongs_to_many_association class doesn't respect the database
connections that the models are trying to use - instead, it uses the universal
database connection to try and look up the join table - so, what was going
wrong was that ActiveRecord was looking in the development environment's
database, when it should have been looking in the login database.
Unfortunately, short of updating your version of ActiveRecord/Rails or patching
this class, it seems that there isn't really any way of avoiding this problem -
you have to drop back to using has_many :through with a Model representing your
join table. I can, though, at least vouch that once you have done this, it does
work as expected, which, in the end, is what we want. It still feels a bit
hacky though....

