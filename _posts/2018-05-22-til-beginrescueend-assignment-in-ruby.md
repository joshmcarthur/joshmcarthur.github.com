---
layout: post
title: "TIL: Begin/rescue/end assignment in Ruby"
description: "Today I learned that the begin/rescue/end construct in Ruby can be used to assign to variables."
category: TIL
tags: [til,technology,ruby]
---

Today, while working on consuming a third-party API, I discovered that the result of a begin/rescue/end block in Ruby can assign to a variable, just like an `if` statement can. 

This isn't a technique I'd recommend for every single situation where it _could_ be used, but it is convenient for operations where a particular error scenario can result in a single return value. 

Here's an example of reading a remote file and assigning it to an object. If the file operation fails (in this case, if the HTTP request fails with anything other than a 2xx or 3xx status), a fallback value is assigned instead:

``` ruby
require "ostruct"
require "open-uri"

model = OpenStruct.new
model.title = begin
  open("https://gist.githubusercontent.com/joshmcarthur/69cffbb395fc3781e23b56d9281f6f73/raw/7b31ea464799077cddd79cfe22105d7364497cdd/title.txt")
rescue OpenURI::HTTPError
  "Default Title"
end

puts model.title
# => This is a title from a remote file
```

