---
layout: post
title: "Howto: Database Backup and Restore"
date: 2011-09-23 13:26
comments: true
categories: howto
tags:
  - howto
  - development
  - mysql
  - postgresql
---

An inherent part of developing web applications is managing your datastores - typically, a relational database such as MySQL or PostgreSQL. Today, I'm going to quickly cover off how to backup and restore for both of these databases.

## What you'll need ##

* Either PostgreSQL or MySQL
* Access to a database (preferably one with data in it)

## Why this is useful to know ##

Lots of interactions with databases have the potential to destroy or modify data (in a bad way). When using frameworks such as Ruby on Rails, it's even easier to, say, accidently delete all of your Users (Horribly easy in DataMapper, unfortunately). It's important that before you do anything with data that's destructive, you have a backup of your database that you can restore from quickly and easily.

## PostgreSQL ##

Postgres databases are backed up using the `pg_dump` command - a command-line utility that comes packaged with the database server. Here's the command:

{% highlight sh %}
    pg_dump --no-owner -U [username] -W [database_name] > [file to dump to].sql.dump
{% endhighlight %}

Let me explain these options and why I use them:

* `--no-owner`: By default, Postgres dumps the database with lots of SET OWNER TO statements. I like to take these out of the dump, as I'm not necessarily restoring the dump to exactly the same server with exactly the same users. Using --no-owner means that ownership statements will be excluded.
* `-U [username]`: This lets you pass in the database user name your web application usually uses to connect - using this is just good practise, as it ensures that what you're dumping is exactly what the web application has.
* `-W`: This option, used in conjunction with the `-U` flag, prompts for the password when you run the command
* `[database_name]`: This is the name of the database that you want to dump
* `[file to dump to]`: This is the file that the SQL script that pg_dump produces will be piped into. I normally name this file with the `.sql.dump` extension, so that I can see it's a SQL dump straight off.


#### Restoring a database dump ####

Restoring a Postgresql dump is really easy, and involves using the standard `psql` client to connect to the database and execute the SQL script in your dump file.

First of all, make sure that you have created the database you want to load the data into. In this example, let's say I've dumped from the `facebook_production` database to the file `facebook_production_23092011.sql.dump`, and I want to restore into the `facebook_development` database so that I can test out some code against some production data. I want to connect to the database using psql as the web application user, and load the dump in:

{% highlight sh %}
    psql -U facebook -W facebook_development < facebook_production_23092011.sql.dump`
{% endhighlight %}

Note how I am using the opposite of the less-than symbol I used above - this basically denotes the direction of the data - it's coming _from_ the file, going _to_ the database.

Upon running this commmand (with your own database, of course), you will first be prompted for your database user's password, and will then see a bunch of SQL statements being executed. Once it's completed, your database has been loaded successfully - you can jump in using psql if you'd like, and query around a bit.

## MySQL ##

MySQL databases are backed up with the `mysqldump` program - one I'm not as familiar with as Postgres, but I know the basics, and largely that's all you need with this type of thing. The main thing to keep in mind is that the process is the same as for PostgreSQL above - use the dump program to write the database out to a file (in the form of SQL statements), and then use the database client program `mysql` in this case, to execute the commands in the file against the database being restored to. Here's the command to dump a MySQL file to disk:

{% highlight sh %}
    mysqldump -U [username] -P [database_name] > [file to dump to].sql.dump
{% endhighlight %}

The options are more or less as I've described above, except that `-P` is substituted for `-W`, and I've still stuck with the `.sql.dump` naming scheme.

#### Restoring a database dump ####

This process is almost identical to the PostgreSQL restore process. Let's stick with the same example format we already have - dumping from a database called `facebook_production` to file `facebook_production_23092011.sql.dump`, restoring into a database called `facebook_development` - here's the command we need for that:

{% highlight sh %}
    mysql -U facebook -P facebook_development < facebook_production_23092011.sql.dump
{% endhighlight %}

Once again, you'll be prompted for your password, but for this one you won't see the output of the SQL statements - it will take a couple of seconds, and then the program will exit. This is normal however - if you'd like to see the output of the batch load, you can add `-v -v -v` before the `<` symbol to turn verbosity to level three, otherwise you can go ahead and jump into your database and make sure everything is there.

## Tips: ##

* If you don't have a database user account yet, on Unix and Linux you can use `sudo su postgres` to login as the 'postgres' user - a root-like database user that gets created for you when Postgres is installed. MySQL has a root account, but it's not a system user - you are normally prompted for a root username and password when you install MySQL. If you _are_ using the Postgres user, you don't need to pass in a username or password in the above commands, but you need to remember that your restored databases will be owned by 'postgres', not you web application database user.
* A handy place to put database dumps that you are planning to use right away is `/tmp` (Only on Unix and Linux). This is a directly that is writeable by everyone, that will get 'garbage collected' periodically. This is especially handy if you are logging in as the 'postgres' user, as typically this user won't have write permissions on many other directories


