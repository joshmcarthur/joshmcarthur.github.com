---
layout: post
title: "Introspecting PostgreSQL indexes"
description: "How to use the `pg_indexes` relation to instrospect indexes"
category: TIL
tags: [til,techology,databases]
---

Today I learned of a useful internal Postgres relation - `pg_indexes`. This relation contains the
name, definition and metadata of each index that exists in the database.

The index definitions are particularly useful, as this allows for pretty simple programmatic (or
human, althought the `\di` psql command would be better for this) analysis or execution of index
commands. The definition is stored in this table as a SQL statement that can be executed to recreate
the index. 

My specific use-case where I found this useful was in a Ruby script that was performing a bulk
update of millions of rows on a large database table (actually it was several tables, but this
example applies equally to a single table). 

My first iteration of this script found that it took an extremely long time to run, as the various
constraints and indexes that existed on the database needed to be checked as each row was updated.
If I could find a way of deferrring these checks until the end of the update operation, then I could
commit the modified data while bringing my constraints and indexes back up to date.

Using `pg_indexes`, I found it really simple to store a collection of index names and definitions in
a variable, run and commit my database update statements, and then restore the indexes:

{%code ruby %}
# { "my_index_name" => "CREATE INDEX my_index_name ON ..." }
indexes = execute("
  SELECT indexname, indexdef
  FROM pg_indexes
  WHERE tablename='my_table_name'
").inject({}) { |acc, row| acc[row["indexname"]] = row["indexdef"] }

indexes.each { |name, _definition| execute("DROP INDEX #{name}") }

transaction do
  MyBulkTableUpdater.update
end

indexes.each { |_name, definition| execute(definition) }
{%endcode%}

> This example assumes it is being run in a file where migration methods like `execute`
> and `transaction` are available. 

This code is working well, however it is important to be aware - there are **caveats**!

1. For the duration of the update, the table in question will not have indexes. This can have an
   extremely detrimental effect on performance!
2. `DROP TABLE` requests an exclusive lock on the table the index belongs to, blocking reads and
   writes until the `DROP INDEX` completes. `DROP INDEX CONCURRENTLY` is an alternative, but this
   type of operation must wait for the table to be inactive (idle), so may not drop indexes before
   updates start.
3. `CREATE INDEX` - which is what the index definition in `pg_indexes` contains - will lock your
   ration of the time the index requires to calculate - which, for large tables could be a long
   time. Reads are not affected by creating an index. Just like `DROP INDEX`, `CREATE INDEX` also
   has a `CONCURRENTLY` option, which _may_ be used if your index was originally created
   concurrently. Concurrent operation does not require a write lock, but does take longer to
   finish building the index.
4. **MOST IMPORTANTLY:** You are _literally_ dropping your indexes here. Understand the table size,
   index size and performance requirements of the table and temporarily removing indexes can speed
   up bulk operations significantly. Just be prepared for things to go wrong - have a rollback plan,
   and BACKUPS!

