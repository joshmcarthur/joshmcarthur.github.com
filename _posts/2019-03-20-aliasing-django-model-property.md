---
layout: post
title: "Aliasing Django model property"
description: "How to expose a Django model alias as a property"
category: TIL
tags: [til,technology,python]
---

Not a super common occurrence, but exposing a Django model property under an alternative name is
occasionally useful. I have used it before to assist in polymorphism, where several very similar
models needed to have the same attribute.

Given a Django model like:

``` python
from django.db import models

class Widget(models.Model):
    email = models.CharField(max_length=254)
```

We can naievy try and alias the attribute by defining an accessor for it:

``` python
# ...

class Widget(models.Model):
    def username(self):
      return self.email
```

This appears to work - _except_ when we go to use it, we find that `Widget().username` isn't a
property - it's a callable method. This means that we can't use it as an alias, since `username`
would need to be accessed using `username()`, while `email` would be immediately accessible as
`email`.

Fortunately, Python has a method decorator avilable called `@property`. This decorator is a way of
signalling to the class that a particular method can be used to get or set an attribute on the
class. We can use the `@property` decorator in our `Widget` class to alias our attribute nicely now:


``` python
from django.db import models

class Widget(models.Model):
    email = models.CharField(max_length=254)

    @property
    def username(self):
      return self.email
```

And we can access the email using either `widget.email` OR `widget.username`. Nice!

If you wish this alias to be bound in both directions (getting the attribute as well as setting the
value), this is also possilble, you just need to define an additional method:

``` python

from djang.db import models

class Widget(models.Model):
  email = models.CharField(max_length=254)

  @property
  def username(self):
      return self.email

  @username.setter
  def set_username(self, username):
     self.email = username
```



