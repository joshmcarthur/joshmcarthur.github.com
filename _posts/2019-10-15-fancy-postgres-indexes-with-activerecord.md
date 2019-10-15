---
layout: post
title: "Fancy Postgres indexes with ActiveRecord"
description: "Strings can be passed to the column value in Rails to do some fancy things."
category: TIL
tags: [til,technology,rails,activerecord]
---

Another day, another undocumented Rails feature!

This time, it's that [`ActiveRecord::Base.connection.add_index`](https://apidock.com/rails/ActiveRecord/ConnectionAdapters/SchemaStatements/add_index) supports an undocumented option to pass a string argument as the value for 'column'. 

This string is passed directly to the SQL statement, making it possible to use all sorts of fun things to lock down the constraint. It also means that you can make an index more declaratively if you're not comfortable using the built-in options for key lengths or ordering.

Here's a real-life example of the String invocation, where I am making a case-insensitive unique index on folder titles that ignores leading and trailing whitespace:

``` ruby
add_index :folders,
          "user_id, TRIM(BOTH FROM LOWER(title))",
          unique: true,
          name: :user_folders_title_unique_idx
```

I'm making a unique index on `"folders"."title"`, scoped to `"folders"."user_id"`. All standard so
far, _except_ for how the title is declared:

`TRIM(BOTH FROM LOWER(title))`

These are _Postgres functions_, and will act on the value that is passsed to it. In this case,
[`TRIM`](https://www.postgresql.org/docs/11/functions-string.html#id-1.5.8.9.5.2.2.12.1.1) will
strip whitespace from the string passed to it. I'm adding `BOTH` so that both leading and trailing
whitespace is trimmed.
[`LOWER`](https://www.postgresql.org/docs/11/functions-string.html#id-1.5.8.9.5.2.2.5.1.1),
unsurprisingly, converts the string passed to lowercase. 

As far as I know, because this is passed directly to the `CREATE INDEX` call, any thing that could
be passed to a raw SQL index creation call can be provided to this argument of `add_index`. 

I have also verified that the index call is correctly serialized in `schema.rb`. In the case of the
above index, it is recorded as:

``` ruby
create_table "folders", force: :cascade do |t|
  # ...
  t.index "user_id, btrim(lower((title)::text))", name: "user_folders_title_unique_idx", unique: true
end
```

Finally, something important to note: Rails can normally figure out what the index should be called
by sticking the table name and column names you want in your index together with underscores. Not so
in this case - because you are passing your own index statement, you _must_ provide the `name: `
option to `add_index` like I have above, so that the index can be identified. 

