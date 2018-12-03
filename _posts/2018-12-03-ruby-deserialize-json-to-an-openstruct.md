---
layout: post
title: "Ruby: Deserialize JSON to an OpenStruct"
description: "How to deserialize a JSON object into an actual nested object instead of a hash"
category: TIL
tags: [til,technology,rails]
---

Deserializing JSON from API responses, files and the like is a pretty common task. Depending on the
complexity of the JSON structure, this can be a bit difficult to work with though, since the default
action of `JSON.parse` is to deserialize to a string-key Hash. This means that after parsing the
JSON, there's a lot of `fetch`ing, `dig`ing, and the like to get things working, and the code
doesn't usually come out super readable.

An alternative to this is based on an argument that I stumbled across this afternoon -
`object_class`. This option _defaults_ to `Hash`, but can be set to anything you like. The best
example of this is what happens when `object_class` is set to `OpenStruct`:

``` ruby
require 'open-uri'
require 'openstruct'
require 'json'

me = JSON.parse(open("https://api.github.com/users/joshmcarthur").read, object_class: OpenStruct)

me.login
=> "joshmcarthur"

me.name
=> "Josh McArthur"
```

It even works with nested objects!

``` ruby
repo_uri = "https://api.github.com/repos/joshmcarthur/joshmcarthur.github.com"

repo = JSON.parse(open(repo_uri).read, object_class: OpenStruct)

repo.owner.login
=> "joshmcarthur"


repo.full_name
=> "joshmcarthur/joshmcarthur.github.com"
```

While the examples above are using `OpenStruct`, it works equally well with a class of your own
creation - the only requirement is that your `initialize` method accepts a Hash structure. 

