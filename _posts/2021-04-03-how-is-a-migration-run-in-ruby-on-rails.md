---
layout: post
title: "What happens when I run 'rake db:migrate' in Ruby on Rails?"
description: "Step through how a migration is run in Rails"
category: step-through
tags: [technology,rails,activerecord,step-through]
---

**This post is written stepping through the most recent stable branch of Rails
on Github: [`6-1-stable`](https://github.com/rails/rails/tree/6-1-stable). It
may not remain up to date.**

<small><a href="#content-start" class="screen-reader-only">Skip table of contents</a></small>

* TOC
{:toc}

<div id="content-start"></div>

## How is the 'db:migrate' rake task defined?

### The Rails gem includes 'activerecord' as a gem dependency:

``` ruby
 s.add_dependency "activerecord",  version
```

&mdash; [rails/rails.gemspec](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/rails.gemspec#L35)

> `version` is set by reading a file named 'RAILS_VERSION' in the 'rails' gem
> directory. In [this
> branch](https://github.com/rails/rails/blob/6-1-stable/RAILS_VERSION), this is
> 6.1.3.1. This means that the core gem versions like ActiveRecord track the
> Rails gem version exactly.

### The activerecord gem adds it's own 'lib/` directory to Ruby's load path:

``` ruby
  s.require_path = "lib"
```

&mdash; [rails/activerecord/activerecord.gemspec](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/activerecord.gemspec#L21)

### The 'activerecord' gem 'railtie' file is `require`-d by Rails

This can happen in two ways: either by `config/application.rb` [requiring
'rails/all'](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/railties/lib/rails/generators/rails/app/templates/config/application.rb.tt#L4),
or by `config/application.rb` specifically loading the Railtie:

``` ruby
require "active_record/railtie"
```

&mdash: [rails/railties/lib/rails/generators/app/templates/config/application.rb.tt](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/railties/lib/rails/generators/rails/app/templates/config/application.rb.tt#L10))

### ActiveRecord Railtie is evaluated

A 'Railtie' appears in most Rails-related gems. It's like an initializer, but
for a library to set itself up within Rails, rather than within your
application. Railties are used to do things like [set up default configuration](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/railtie.rb#L29),
[declare
initiaizers](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/railtie.rb#L70),
and **define Rake tasks**:

``` ruby
rake_tasks do
  namespace :db do
    task :load_config do
      if defined?(ENGINE_ROOT) && engine = Rails::Engine.find(ENGINE_ROOT)
        if engine.paths["db/migrate"].existent
          ActiveRecord::Tasks::DatabaseTasks.migrations_paths += engine.paths["db/migrate"].to_a
        end
      end
    end
  end

  load "active_record/railties/databases.rake"
end
```

&mdash;
[rails/activerecord/lib/active_record/railtie.rb](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/railtie.rb#L38)

> See that `ENGINE_ROOT` bit? That checks to see if ActiveRecord is being run
> within an 'engine'. A [Rails
> engine](https://guides.rubyonrails.org/engines.html) is a bit like an
> application-within-an-application, and _it can have it's own migrations_. That's
> what this code is doing - if it's running in an engine, it checks to see if that
> engine has a `db/migrate` folder. If it does, it adds the engine's migrations to
> the list of all the places ActiveRecord's database tasks (like `db:migrate`)
> should look for migration files.
>
> For the rest of this guide, we'll assume we're not in an engine, so this block
> doesn't affect us. The **load** line is the important bit.

### ActiveRecord Database Rake tasks are defined

'databases.rake' has a special 'rake' extension. 'rake' files are specially
evaluated in the context of the [rake](https://ruby.github.io/rake/) tool, that
defines such methods as 'namespace' (group tasks), 'desc' (describe what a task
does), and 'task' (describe a sequence of actions to take).

> I'm not actually sure what Rake does to automatically be able to load .rake
> files with the <abbr title="Domain Specific Language">DSL</abbr> methods
> already loaded. Maybe another post sometime?

Within this lengthy file (ActiveRecord makes use of a lot of Rake tasks to
manage databases), the `db:migrate` task is defined:


``` ruby
desc "Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)."
task migrate: :load_config do
```


&mdash;
[rails/activerecord/lib/active_record/railties/databases.rake](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/railties/databases.rake#L88)

The first thing that will run here is the `load_config` task (that key: value
syntax is how Rake task
[prerequisites](https://ruby.github.io/rake/doc/rakefile_rdoc.html#label-Tasks+with+Prerequisites)
are defined).

`load_config` is pretty simple as well:


``` ruby
task load_config: :environment do
  if ActiveRecord::Base.configurations.empty?
    ActiveRecord::Base.configurations = ActiveRecord::Tasks::DatabaseTasks.database_configuration
  end

  ActiveRecord::Migrator.migrations_paths = ActiveRecord::Tasks::DatabaseTasks.migrations_paths
end
```

If there aren't any configurations, it finds them
([`ActiveRecord::Tasks::DatabaseTasks.database_configuration`](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/railties/lib/rails/application/configuration.rb#L270)
is worth checking out - this is where your `database.yml` file is loaded into
ActiveRecord/Rails!)

It also passes along the `migrations_paths` that we saw earlier when engines
were being set up to the `ActiveRecord::Migrator`. This class will come up again
in the migration process, but for now, this is just setting up the migrator to
know where to load migrations for.

> Speculatively, the reason this is done is because it would be technically
> possible to create more than one instance of a 'migrator', pointing at
> different sets of migrations. Passing this configuration in decouples the
> class that actually 'runs' the migrations from the class that controls the
> registry of migration file locations.

This task depends in turn on the `environment` task. This isn't actually part of
ActiveRecord, but of
[Rails](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/railties/lib/rails/application.rb#L523).

Basically, it "loads" the application, all of it's dependencies, initializers,
etc. - all that slow stuff. No need to go into further detail here, other than
to note that without depending on this task, things like `Rails.env`,
`Rails.root`, and lots of other useful things aren't available.

And now back to the 'migrate' task:

``` ruby
desc "Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)."
task migrate: :load_config do
  original_db_config = ActiveRecord::Base.connection_db_config
  ActiveRecord::Base.configurations.configs_for(env_name: ActiveRecord::Tasks::DatabaseTasks.env).each do |db_config|
    ActiveRecord::Base.establish_connection(db_config)
    ActiveRecord::Tasks::DatabaseTasks.migrate
  end
  db_namespace["_dump"].invoke
ensure
  ActiveRecord::Base.establish_connection(original_db_config)
end
```

Looks like some connection shenanigans going on there. The current database
connection config is stashed in a variable, and restored using an `ensure` block
(this code will always run, even if an exception is raised). A list of
configurations is looked up matching `ActiveRecord::Tasks::DatabaseTasks.env`,
and for each of this environments, `ActiveRecord::Tasks::DatabaseTasks.migrate`
is run.

I've never used this, but since I was curious,
`ActiveRecord::Tasks::DatabaseTasks` is quite simple:

``` ruby
def env
  @env ||= Rails.env
end
```

&mdash;
[rails/activerecord/lib/active_record/tasks/database_tasks.rb](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/tasks/database_tasks.rb#L102)

In other words, unless someone or something sets it otherwise, the environment
that the migrations are run in will be the same as the rest of your application
(`Rails.env`, set from environment variable, command line option, etc). But
migrations _can_ be run in a different environment from the rest of your
application. This could be used if you had a different database user who had
additional privileges to change the database schema from the user that your
application normally runs with.

## How is my migration run when I run `bundle exec rake db:migrate`?

### ActiveRecord::Tasks::DatabaseTasks.migrate

This method is the first sign of migrations actually being 'run':

``` ruby
def migrate
  check_target_version

  scope = ENV["SCOPE"]
  verbose_was, Migration.verbose = Migration.verbose, verbose?

  Base.connection.migration_context.migrate(target_version) do |migration|
    scope.blank? || scope == migration.scope
  end

  ActiveRecord::Base.clear_cache!
ensure
  Migration.verbose = verbose_was
end
```

First, the target version is checked. Usually, this version isn't actually
provided - in this case, it's assumed the runner of the migrations wants the
"latest" version. It _is_ possible to pass an environment variable named
"VERSION" though - and when it _is_ provided, it must [match the expected
format](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/tasks/database_tasks.rb#L261).

Next, the scope is grabbed out an environment variable called 'SCOPE', if
present, and so is the 'verbose' setting for migrations (unsurprisingly, using
an environment variabled named 'VERBOSE').

There's then a block of code that is the next step to run migrations - we'll
loop back to that, but assuming the migrations all go smoothly, the ActiveRecord
cache is cleared with `ActiveRecord::Base.clear_cache!`. [This
method](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/connection_handling.rb#L347)
[clears a bunch of instance
variables](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/connection_adapters/schema_cache.rb#L132)
that are used to save database schema lookups at runtime.

If it looks like this method is just looking up a bunch of runtime configuration
from environment variables then calling something else - that's because it is.
This block of code is simply decoupling environment-variable-based config from
the actual migration process. It's clear from the code block above that the next
step lies in `ActiveRecord::Base.connection.migration_context.migrate`.

### `ActiveRecordBase.connection.migration_context`

This method is called on a connection - that's something a bit different from
what's been seen previously. Remember how in the `db:migrate` rake task
definition, connections were switched around based on the migration environment?
That's where this connection comes into play. From here on in, the migration
code is going to need to know which database to connect to, and how - for this
reason, `migration_context` is defined on `ActiveRecord::Base.connection` (which
is an implementation of an
[AbstractAdapter](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb))
- it can call `self`, and have an actual connection to the database.

`migration_context` actually just builds another class - `MigrationContext`. It
passes two arguments to the initialize method of this class:

1. `migrations_paths` - this has been seen before - it can be overridden in the
   connection config, it looks like (I suspect you can specify
   `migrations_paths` in `config/database.yml` for this to take effect), but
   most of the time it will fall back to the
   `ActiveRecord::Migrator.migrations_paths` method that was set in the last
   method.
2. `schema_migration` - this has a [slightly complex
   definition](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/connection_adapters/abstract_adapter.rb#L139),
   but most of the time ends up being either a `ActiveRecord::SchemaMigration`
   class or subclass.

> `ActiveRecord::SchemaMigration` is an interesting piece in it's own right.
> It's actually a model - a model that's backed by a database table you _may_
> have seen before called 'schema_migrations'. You also _may not_ have seen it
> before, because most of the time it never needs to be touched. It holds the
> 'state' of which migrations have run. It has a [very simple
> schema](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/schema_migration.rb#L25)
> - a single string timestamp column which is also the primary key.

### ActiveRecord::MigrationContext

This class looks complicated, but is mostly a state machine to control the
direction to migrate in. There are a bunch of helper methods to migrate the
database, back (arbitrarily or to a particular version), forward (arbitrarily or
to a particular version), one step backwards from the current version, or one
step forwards from the current version.

Because we know this migration context is being called from `database_tasks.rb`,
we're only interested in the `migrate` method:

``` ruby
  def migrate(target_version = nil, &block)
    case
    when target_version.nil?
      up(target_version, &block)
    when current_version == 0 && target_version == 0
      []
    when current_version > target_version
      down(target_version, &block)
    else
      up(target_version, &block)
    end
  end
```

&mdash;
[rails/activerecord/lib/active_record/migration.rb](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/migration.rb#L1058).

`target_version` came from that `VERSION` environment variable, but most of the
time, if you're running `bundle exec rake db:migrate` in a _normal_ situation,
it'll be `nil`, so we call `up(nil)`. If a specific version was passed, and it's
less than the current migration version (which is looked up from that
'schema_migrations' table), then `down(target_version)` is called.

The `up` method calls the next part of the chain, the `Migrator`:

``` ruby
def up(target_version = nil)
  selected_migrations = if block_given?
    migrations.select { |m| yield m }
  else
    migrations
  end

  Migrator.new(:up, selected_migrations, schema_migration, target_version).migrate
end
```

&mdash;
[rails/activerecord/lib/active_record/migration.rb](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/migration.rb#L1079)

This method looks for migrations to run based on the block, if one is provided -
in `ActiveRecord::Tasks::DatabaseTasks.migrate` one _is_ provided:

``` ruby
migrate(target_version) do |migration|
    scope.blank? || scope == migration.scope
end
```

In other words, if `ENV["SCOPE"]` was provided to the Rake task, only migrations
that match that scope will be run. Migration 'scoping' is based on the filename
of the migration, according to the regular expression stored in
[ActiveRecord::Migration::MigrationFilenameRegexp](https://github.com/rails/rails/blob/a215e47fb14af955071264b20818ca3834f477f2/activerecord/lib/active_record/migration.rb#L574):

```
/\A([0-9]+)_([_a-z0-9]*)\.?([_a-z0-9]*)?\.rb\z/
```

In other words, migrations are expected to be named with two or three parts:

* a version number (integer 0-9). This is usually a timestamp as seconds since
  epoch, but can just be an incrementing number. It has to be present, otherwise
  a [`IllegalMigrationNameError` will be raised](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1131)
* the migration name - alphanumeric characters plus underscores. This is the
  part you normally parse out yourself when scanning the `db/migrations/`
  directory - something like `add_full_name_to_users`.
* the migration scope - after a full-stop character, but before ".rb". The scope
  is used to group migrations. Often, this feature is used by Rails engines to
  identify the origin of a migration. By default, migrations are unscoped.

This is all useful to know, but for the purposes of continuing our journey, most
of the time, scope is blank, so we run pass _all_ migrations along to the
`Migrator` class in our `up` method.

### ActiveRecord::Migrator

This class acts as the 'controller' for a set of migrations. The primary
responsibility it has is to prepare a list of migrations to run, and to then
actually run these migrations (with some advisory lock decoration when this is
is supported).

When the class is initialized, it sets up the schema migration database table (a
reminder - `ActiveRecord::SchemaMigration` is an internal database table that is
used to store the version numbers of migrations that have been run), and the
[internal metadata key-value table](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/internal_metadata.rb#L43) that ActiveRecord uses to store metadata, like the
environment that migrations were last run in.

This class supports running a single migration (provided by 'target version' -
e.g. that `ENV['VERSION']` environment variable again). It uses the [`run`
method
for this](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1241)
In the case of doing a
normal `bundle exec rake db:migrate` though, it performs a different action,
called `migrate` (unsurprisingly). Migrate wraps an advisory lock around running
the migrations. An [advisory
lock](https://en.wikipedia.org/wiki/Lock_(computer_science)) is a feature of
some of some database engines supported by Rails, which is just that - advisory.
The migrations check for an advisory lock, and if one exists in the database, a
[`ConcurrentMigrationError` is
raised](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1399),
halting the migrations. If a lock doesn't already exist, a new advisory lock is
created, preventing any other migrations being run until the advisory lock is
released.

With the advisory lock issued, or if advisory locks are not enabled,
`migrate_without_advisory_lock` is called, getting a step closer to running
migrations.

``` ruby
def migrate_without_lock
  if invalid_target?
    raise UnknownMigrationVersionError.new(@target_version)
  end

  result = runnable.each(&method(:execute_migration_in_transaction))
  record_environment
  result
end
```

`invalid_target?` only runs if an actual `target_version` is provided - it
ensures that the version that _was_ provided [is not zero, and that a migration
actually exists that matches that
version](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1319).

The actual 'migration' is pretty simple - it calls
'execute_migration_in_transaction' with each migration. The `runnable` definition
is worth looking into, since it's actually the thing that decides _what_ will be
run:

``` ruby
def runnable
  runnable = migrations[start..finish]
  if up?
    runnable.reject { |m| ran?(m) }
  else
    # skip the last migration if we're headed down, but not ALL the way down
    runnable.pop if target
    runnable.find_all { |m| ran?(m) }
  end
end
```

The `migrations` method is also relevant:

``` ruby
def migrations
  down? ? @migrations.reverse : @migrations.sort_by(&:version)
end
```

So, if we are migration 'up' (which we are, since we're running `db:migrate` and
not `db:rollback`), migrations are ordered by their version (e.g. in ascending
order). Any migrations that have already been run are skipped - migrations have
been run if they exist in the `schema_migrations` table. [`start`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1347)
is determined by the current migration version (again, this is the 'maximum'
value number fom the `schema_migrations` table), or zero if there are no version
numbers in the table (this is the case, for example, with a just-created
database). [`finish`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1343) is determined by either the index of the migration file if a
target version has been provided (which is not the case, if `rake
db:migrate` is being run without any environment variable arguments), or the
last index of the migrations list (e.g. size - 1).

`execute_migration_in_transaction` is the final step in the `Migrator` before
the actual migration is 'called' (we'll get to what this means in a second):

``` ruby
def execute_migration_in_transaction(migration)
  return if down? && !migrated.include?(migration.version.to_i)
  return if up?   &&  migrated.include?(migration.version.to_i)

  Base.logger.info "Migrating to #{migration.name} (#{migration.version})" if Base.logger

  ddl_transaction(migration) do
    migration.migrate(@direction)
    record_version_state_after_migrating(migration.version)
  end
rescue => e
  msg = +"An error has occurred, "
  msg << "this and " if use_transaction?(migration)
  msg << "all later migrations canceled:\n\n#{e}"
  raise StandardError, msg, e.backtrace
end
```

The first two lines guard against the migration already being run. Next, the
migrator opens a database transaction ([`ddl_transaction`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1378) calls
[`use_transaction?`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1386), which wraps the block in a transaction unless the migration
itself has signalled that it should not be run in a transaction (which is
necessary for _some_ specific database operations, and can be specified in a
migration using the [`disable_ddl_transaction!`](https://api.rubyonrails.org/classes/ActiveRecord/Migration.html#method-c-disable_ddl_transaction-21) method, or if transactions are
disabled or unavailable for the database connection).

After the transaction is begun, the `migrate` method is called on the migration,
then
[`record_version_state_after_migrating`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L1359)
is called, which updates the `schema_migrations` table. If anything goes wrong
during the migration, a descriptive error is raised. You might recognise this error message from your own migrations: "An error has occurred, this and
all later migrations canceled".

### Your migration! (ActiveRecord::Migration)

At this point, the migrator has figured out which migrations need to be run, and
is running them one by one in a transaction. It's now up to your migration.
Let's say the migration you've written performs the following action:

``` ruby
class CreateBlogs < ActiveRecord::Migration[6.1]
  def change
    create_table :blogs do |t|
      t.string :name, unique: true
      t.timestamps
    end
  end
end
```

> That square-bracket syntax is a bit unusual. It's the way that Rails has
> chosen to be able to support older migrations written for previous versions of
> Rails. The `ActiveRecord::Migration` class [implements the `self.[]`
> method](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L566),
> which looks up the correct concrete migration class to use from the
> [`ActiveRecord::Migration::Compatibility`
> class](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration/compatibility.rb).
> This class contains a number of subclasses named after Rails major/minor
> versions, where each subclass overrides the current (e.g. Rails 6.1) migration
> methods to apply the previous versions' default options. In this way,
> migrations back to Rails 4.2 can be supported, even though ActiveRecord 6.1 is
> installed. Neat!

We saw that the `ActiveRecord::Migration::Migrator` calls the `migrate` method
on the migration class. What does this look like?

Turns out it's pretty simple:

``` ruby
def migrate(direction)
  new.migrate direction
end
```
&mdash;
[rails/activerecord/lib/active_record/migration.rb](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L662)

OK, so this creates a new instance of the migration class, and then calls
`migrate` on _that_. Here's the instance method:

``` ruby
# Execute this migration in the named direction
def migrate(direction)
  return unless respond_to?(direction)

  case direction
  when :up   then announce "migrating"
  when :down then announce "reverting"
  end

  time = nil
  ActiveRecord::Base.connection_pool.with_connection do |conn|
    time = Benchmark.measure do
      exec_migration(conn, direction)
    end
  end

  case direction
  when :up   then announce "migrated (%.4fs)" % time.real; write
  when :down then announce "reverted (%.4fs)" % time.real; write
  end
end
```

So, if the `direction` is `:up` (which it is for our purposes, since we're
running `bundle exec rake db:migrate`), it
[announces](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/migration.rb#L880)
that the migration is beginning, then calls `exec_migration` (the next step!)
using a connection checked out from the connection pool and wrapped in
[`Benchmark.measure`](https://ruby-doc.org/stdlib-2.7.1/libdoc/benchmark/rdoc/Benchmark.html#method-c-measure)
to measure the amount of time taken to run the block (i.e. the actual migration
operations). Once that's done, the connection pool block completes, returning
the connection to the pool, then the total time taken to run the migration is
announced. With these announce methods, the migration will run, and the
migration output you are probably used to will be shown:

``` sh
== 20210404082749 CreateBlogs: migrating ======================================
-- create_table(:blogs)
   -> 0.0091s
== 20210404082749 CreateBlogs: migrated (0.0092s) =============================
```

So, `migrate` instruments the actual migration operation, and provides some
informative messaging output. What about the actual migration? For that, we need
to jump into one more method - `exec_migration`:

``` ruby
def exec_migration(conn, direction)
  @connection = conn
  if respond_to?(:change)
    if direction == :down
      revert { change }
    else
      change
    end
  else
    public_send(direction)
  end
ensure
  @connection = nil
end
```

Some of these methods are maybe starting to look familiar, and may even match
what is in your migration! If the migration has a `change` method, and the
direction is not `:down`, then the change method of our migration is called,
using the passed-in connection from the connection pool. If the migration does
not implement `change` (it _is_ optional after all, but if you don't implement
`change`, then you should ideally implement both `up` and `down` to make sure
your migration can run in both directions), then it calls either the `up` or
`down` method, depending on the direction - this will be the `up` method in our
case, since we're migrating and not rolling back.

Now, whatever is in our own migration's `change` method will be run, altering
the database!

> Rolling back a change method wraps the `change` method in a block passed to
> `revert`. This method is called on the database connection, which reverses any
> operations called on the connection within the block - `create_table` becomes
> `drop_table`, `add_column` becomes `remove_column`, etc.

### Updating db/schema.rb

If you've run a migration before, you'll probably have noticed that running a
migration (or rolling back a migration) tends to also update `db/schema.rb`.
Where does this change come from? To answer this question, we need to go all the
way back to the `db:migrate` Rake task definition, and take a closer look at the
last line:

``` ruby
desc "Migrate the database (options: VERSION=x, VERBOSE=false, SCOPE=blog)."
task migrate: :load_config do
  original_db_config = ActiveRecord::Base.connection_db_config
  ActiveRecord::Base.configurations.configs_for(env_name: ActiveRecord::Tasks::DatabaseTasks.env).each do |db_config|
    ActiveRecord::Base.establish_connection(db_config)
    ActiveRecord::Tasks::DatabaseTasks.migrate
  end
  db_namespace["_dump"].invoke
ensure
  ActiveRecord::Base.establish_connection(original_db_config)
end
```

So, migrations are run, and then another Rake task is called -
`db_namespace["_dump"]`:

``` ruby
task :_dump do
  if ActiveRecord::Base.dump_schema_after_migration
    db_namespace["schema:dump"].invoke
  end
  # Allow this task to be called as many times as required. An example is the
  # migrate:redo task, which calls other two internally that depend on this one.
  db_namespace["_dump"].reenable
end
```

This is just a proxy for `rake db:schema:dump` then - if
`dump_schema_after_migration` is truthy, it calls the actual task, then
re-enables itself to allow it to be called again (by default, Rake tasks can
only be invoked once, hence why it must be re-enabled).

The `rake db:schema:dump` task looks very similar to the migration task:

``` ruby
task dump: :load_config do
  ActiveRecord::Base.configurations.configs_for(env_name: ActiveRecord::Tasks::DatabaseTasks.env).each do |db_config|
    ActiveRecord::Base.establish_connection(db_config)
    ActiveRecord::Tasks::DatabaseTasks.dump_schema(db_config)
  end

  db_namespace["schema:dump"].reenable
end
```

It looks up which connection configurations should be used for database tasks,
establishes a connection, and calls `dump_schema` on `DatabaseTasks`.

Going all the way down the rabbithole of how the schema gets dumped is probably
another step-through in it's own right. Let's stop here by noting that
[`ActiveRecord::Tasks::DatabaseTasks.dump_schema`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/tasks/database_tasks.rb#L378)
uses
[`ActiveRecord::SchemaDumper`](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/schema_dumper.rb)
to produce a formatted Ruby file containing the necessary ActiveRecord methods
to reconstruct the database.

> This is the case if the schema format is set to :ruby, which is the default.
> The schema can also be stored as SQL, which allows the exact database schema
> to be dumped to a file named db/structure.sql, at the expense of database engine compatibility (e.g. a dumped
> PostgreSQL schema will only be restorable to databases using the PostgreSQL
> database engine, not MySQL,
> SQLite or others). When preparing structure.sql, a database engine-specific
> tool is used to dump the schema, rather than anything in  ActiveRecord. For
> PostgreSQL, `psql --no-owner --schema-only` [is
> used](https://github.com/rails/rails/blob/58c3c62cad0b79ec1f977d827ccd3849cc7f99c1/activerecord/lib/active_record/tasks/postgresql_database_tasks.rb#L49).

---

Once our migration is run, and schema.rb is updated with the database schema
changes - that's it! Our database is up to date, and ready for us to use the new
or modified data structure our migration has handled.





