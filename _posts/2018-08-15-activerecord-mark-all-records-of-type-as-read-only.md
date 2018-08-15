---
layout: post
title: "ActiveRecord: Mark all records of type as read only"
description: "If you have a type of record you want to ensure is never written to, the read-only flag is useful."
category: TIL
tags: [til,rails,technology]
---

Note: This post is created based on [this Stackoverflow Answer](https://stackoverflow.com/a/16923830). 

Occasionally, you may have a type of record that already exists in a database which you wish to read
from, but never modify. In these situations, it can be worth adding a little code to mark these
types of records as read-only. This will prevent _most_ ActiveRecord data modification methods to
raise an `ActiveRecord::ReadOnly` exception if code attempts to create or update such a
record. Note that read only records do not appear to be protected from destruction!

To mark an individual record as readonly, there is an [`ActiveRecord::Base`
method](https://apidock.com/rails/ActiveRecord/Core/readonly%21) available to help with this. This
post concerns marking an entire type of model as readonly. Examples of when this may be necessary
include integrating with an external or third-party database, migrating content from one table to
another, and supporting shared or private data.

There are two approaches I have seen for marking an entire type of record as readonly, affecting
every instance. 

The first is the one I prefer, as it doesn't rely on ActiveRecord callbacks:

``` ruby
class MyModel < ApplicationRecord
  ##
  # Mark all instances of this type of record as readonly.
  # The logic for this method can be changed if more complicated logic is required.
  def readonly?
    true
  end
end
```

If you prefer a simpler implementation and don't mind callbacks, the following implementation also
works:

``` ruby
class MyModel < ApplicationRecord
  after_initialize :readonly!
end
```


