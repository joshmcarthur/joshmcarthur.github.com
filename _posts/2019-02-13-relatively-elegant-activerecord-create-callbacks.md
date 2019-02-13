---
layout: post
title: "Relatively elegant ActiveRecord create callbacks"
description: "ActiveRecord callbacks can be hard to test and get messy, but create can be passed a block, which lends itself to callback-like behaviour."
category: TIL
tags: [til,technology,rails]
---

ActiveRecord callbacks are pretty popular in the Rails community, but they do have pitfalls.
Probably the most significant one is that the responsibilities of a model can creep quite a lot once
callbacks begin getting defined. Callbacks can also be hard to test, since they are triggered under
a range of conditions, and have multiple phases per condition (before/around/after initialize,
validate, create, etc).

There is an interesting, little-known ability to pass a block to the
[`create`](https://apidock.com/rails/ActiveRecord/Persistence/ClassMethods/create) method of an
ActiveRecord model. This can be an elegant way of passing a callback method, from something like a
service or form object to allow a model to set attributes on itself immediately before saving.

Here's an example:

``` ruby
# app/services/ticket_creator.rb
class TicketCreator
  def create(summary:)
    Ticket.create!(summary: summary, &:assign_reference)
  end
end
```

In this example, our ticket creator service passes the attributes to `create` as usual, but also
passes a proc reference to the `assign_reference` method of the model - in other words, this is a
shorthand, which could also be written as:

``` ruby
Ticket.create(attributes) do |ticket|
  ticket.assign_reference
end
```

In this example, we would expect `assign_reference` to be implemented inside the `Ticket` model like
so:

``` ruby
# app/models/ticket.rb
class Ticket
  def assign_reference
    TicketReference.new.generate!
  end
end
```

Personally, I find this approach to be a lot cleaner than a normal callback, since the invocation of
the callback method isn't linked directly into the model. It is invoked _on_ the model, but not _by_
the model. In this case, it is called by a service object, but could just as easily be invoked from
a controller, mailer, or any other class really. It is also relatively easy to test, since we can
test the result of the service method being called, rather than the core `create` method.

