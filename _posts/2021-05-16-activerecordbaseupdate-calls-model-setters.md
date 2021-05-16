---
layout: post
title: "ActiveRecord::Base.update actually calls model setter methods"
description: "A useful tip to leverage when passing attributes to a model to update"
category: TIL
tags: [til,rails]
---

When an update method like `@my_record.update(test_attr_1: "foo", test_attr_2: "bar")` is called, my assumption was that those attributes immediately got passed to some ActiveRecord magic to update the record. Not true! Each attribute key calls the setter on the object - in this case, `@my_record.test_attr_1=(new_value)` and `@my_record.test_attr_2=(new_value)` would be called.

This is neat because you can 'redirect' that attribute assignment to actually do something else, like set a different column. Here's what an example that shows how to allow a boolean to be passed into an attribute called "enabled" that instead sets a "enabled_at" timestamp:

```ruby
  def enabled=(flag)
    self.enabled_at = flag ? Time.zone.now : nil
  end

  def enabled?
    enabled_at.present?
  end
```

Usage:

```ruby
# Updating
thing = Thing.last
thing.update(enabled: true) # Sets enabled_at to Time.zone.now and saves
thing.enabled? # => true
thing.update(enabled: false) # Sets enabled_at to nil and saves
thing.enabled? # => false

# Instantiating
thing = Thing.new(enabled: false)
thing.enabled? # => false

# Assign before save
thing = Thing.last
thing.assign_attributes(enabled: true) # Enabled, but not saved yet!
thing.save! # OK, saved now

# And of course this works the same as any other model attribute
# when it comes to form/template stuff:

# In ThingController#create:
params.require(:thing).permit(:name, :description, :enabled)

# Template:
<%= f.check_box :enabled %>
```

You could even do more than one assignment - for example, a `publish` boolean might manage more than one timestamp:

```ruby
def publish=(should_publish)
  if should_publish
    self.published_at = Time.zone.now
    self.unpublished_at = nil
  else
    self.published_at = nil
    self.unpublished_at = Time.zone.now
  end
end
```

In the scenario of publishing, this method is useful because if a record is unpublished, knowing _when_ this happened is relevant - just setting `published_at` to `nil` wouldn't indicate this.

> Note: Anything more complex than this should be in its own class. A service object is probably what you are looking for.
