---
title: Detecting the origin of an ActiveRecord record's destruction
---

In a `before|after_destroy` callback, you can use the
[`destroyed_by_association`](https://api.rubyonrails.org/classes/ActiveRecord/AutosaveAssociation.html#method-i-destroyed_by_association)
method to access the association (therefore the parent record or parent record
type) that is causing this record to be destroyed. This is also a handy way to
tell the difference betwee` a ‘direct’ destruction (`widget.destroy`), and a
‘dependent’ destruction `has_many :widgets, dependent: :destroy`).

I had a use case for this recently with a `before_destroy` callback intended to
prevent a record from being 'orphaned' - that is, a record that should always
have at least one of something, where destroying the record would cause it to
have none.

I implemeneted a 'validating' callback:

```ruby
before_destroy :prevent_orphaned_record

private

def prevent_orphaned_record
  return true unless parent.children.size == 1
  errors.add(:base, :destroy_would_orphan_record)

  throw :abort
end
```

The problem I have with this, is that when the parent record has an assocaition
with dependent destroy, we don't actually want this validation to be triggered,
since, while we are orphaning the record, we are also about to destroy the
parent. An example of an association like this would be:

```ruby
has_many :children, dependent: :destroy
# or
has_one :child, dependent: :destroy
```

What we want to do, is guard the callback, so that if the _parent_ record is
being destroyed, we can allow the record to be orphaned, since it's about to be
destroyed. I tried a few different variations, but eventually found
`destroyed_by_association`. This method returns the _association_, which allows
access to the parent record, as well as the parent record class.

With this method, the guard clause can easily be implemented:

```ruby
def prevent_orphaned_record
  return true if destroyed_by_association # Could also check the specific parent here, etc.
  return true unless parent.children.size == 1

  # etc
end
```
