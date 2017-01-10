---
layout: post
title: "Temporary PostgreSQL Database with Docker"
description: ""
category:
tags: [development, docker, postgres]
---

Every now and then I need to restore an old database backup to grab some data out of. I use Postgres containers for
every app I work on, so I don't really want to go polluting those. Here's how I start a postgres container, restore a DB
into it, do what I need to do, then destroy it.

1. Start the container: `docker run --rm -it -v ``pwd``:/data postgres bash`
  * `--rm` means remove the container when it stops (we exit bash)
  * `-it` means give me a interactive terminal (I need to type stuff and see output)
  * `-v` means mount the directory I'm currently in to `/data` - assuming the directory I'm in has a PG dump I want to use.
2. Now in the container, we need to set up the database engine. The [`postgres`](https://hub.docker.com/_/postgres) container has an entrypoint script that normally
   does this for us, but we've told Docker to run `bash` rather than this script.
 * Create the cluster: `pg_createcluster 9.5 main` (replace 9.5 with whatever version of Postgres you have used)
 * Start Postgres: `service postgresql start`
 * Create a user for 'root': `su - postgres -c "createuser -s root"`

3. Now we have a superuser Postgres user named "root", we can do whatever we want, for example:
 * `createdb my_database`
 * `cd /data`
 * `psql my_database < my_database_backup.sql`
 * `psql my_database`
 * `SELECT count(*) from widgets`

4. When we're done, we just need to exit bash. The container will stop and be removed by Docker.
