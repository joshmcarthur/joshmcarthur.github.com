---
layout: post
title: "ActiveRecord's establish_connection"
description: "establish_connection is a core method to ActiveRecord which is much more flexible than you might think."
category: TIL
tags: [til,technology]
---

If you've ever wondered how your Rails ActiveRecord models end up magically translating some connection details (probably you have these in `config/database.yml`) into data you can interact with, `establish_connection` is a pretty significant part of that magic. In this post, I'm going to be laying out the different arguments this method accepts to determine how to connect to a database. Just so you know, this is largely a paraphrasing of [the APIDock documentation](https://apidock.com/rails/ActiveRecord/ConnectionHandling/establish_connection) to reinforce these arguments in my memory, so if you would prefer to directly read the documentation, go ahead.

## Normal operation

Your standard Rails set up has your database connection settings listed per-environment in `config/database.yml`. You probably at least have settings in this file for `development` and `test`, but may have other environments there as well. The normal definition of a model (e.g. what you get if your application models inherit from `ActiveRecord::Base` and don't change any settiings) is to call `establish_connection`, passing a symbolized version of `Rails.env` - `:development`, `:test` and so on.

When `establish_connection` is passed a symbol, it will assume that the symbol is a "configuration". A configuration in this context is a key of the `ActiveRecord::Base.configurations` hash, where the value contains the actual connection settings for your database. When Rails starts, it loads and parses your `config/database.yml` YAML file into this hash, which is exactly how your Rails app knows how to connect to your development, test or even production database.

## Passing connection information via a hash

This argument is the lowest level form of argument that can be passed in to `establish_connection`.
A hash is passed in, containing (at least) a key specifying the ""adapter". Any additional options
are delegated to the particular adapter - MySQL, PostgreSQL, SQLite, etc - however, many of these options
are common across database engines - option names like "user", "host", "password" and "database".
This is why, if you do ever change from one database to another, often the only key that needs to be
changed is "adapter".

This hash is accessed with indifferent access, which means that you can pass in hash keys as either
symbols or strings - either is acceptable. A situation where you might use this kind of argument to 
establish a database connection could be a scenario where you have dynamic connection details -
perhaps you have a multi tenanted application where customers can provide their own database to
use, for exmaple. 

An example of passing a hash to `establish_connection`:

``` ruby
ActiveRecord::Base.establish_connection(
  adapter: "postgresql"
  database: "myapp_development_1"
)
```

## Passing connection information via a connection URI (string)

Finally, a database URL can be passed to `establish_connection`, which will detect the correct
adapter to use from the connection string, and parse other connection details, such as the host,
port, username, password and database to use from the URI. The default of `establish_connection` is
to try and find a URI to a databse in an environment variable named `"DATABASE_URL"`, falling back
to looking up a configuration matching the current Rails environment name (as described in 'Normal
operation'). 

Passing a connection string to `establish_connection` is quite a flexible way of establishing
connections to different databases, and can be used in a number of scenarios where you might
establish to different databases, either when the app starts, or during runtime. 

An example of passing a connection string to `establish_connection`:

``` ruby
ActiveRecord::Base.establish_connection("postgres://postgres@localhost:5432/mydatabase")
```

> Note: For actual applications, it would be more appropriate to store this connection 
> string as configuration, or even as a secret, rather than hardcoding it into your script.

---

I wanted to blog about this particular ActiveRecord for a couple of reasons. First, it is actually a
method that is very widely used, but probably not very well known. Second, while I knew of the
existence of this method, and suspected some of what the method could do, I learned a lot while
having a read through the documentation and implementation of `establish_connection`. It's certainly
one worth remembering.
