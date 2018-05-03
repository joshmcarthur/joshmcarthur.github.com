---
layout: post
title: "Rails console --sandbox"
description: "Rails console has a handy option for running in a sandbox transaction"
category: TIL
tags: [til,technology,rails]
---

Occasionally, a particular bug or customer query will necessitate jumping into a Rails console connected to a live database, or a copy of the live database, that we wish to read from, but not change.

I was reminded today of an option that can be passed to the `rails console` command, `-s`, or `--sandbox`. This wraps the entire console command in a database transaction that will be rolled back when the console is terminated.

The implementation of the `--sandbox` option is actually very simple. When the console starts, `begin_transaction` is called on the `ActiveRecord::Base` connection. A hook is set up to trap `at_exit`, which will rollback any changes made within the sandbox. Here's the implementation:

```ruby
ActiveRecord::Base.connection.begin_transaction(joinable: false)

at_exit do
  ActiveRecord::Base.connection.rollback_transaction
end
```

([source](https://github.com/rails/rails/blob/45ddb7f1f94c2086488aaaac47a1092cf832f381/activerecord/lib/active_record/railties/console_sandbox.rb))

Effectively, this means that when a `rails console --sandbox` command is run, records can be added, removed, changed (and anything else that is processed inside a [database transaction](https://www.postgresql.org/docs/current/static/tutorial-transactions.html) can be done), without it affecting any other part of the Rails application.
