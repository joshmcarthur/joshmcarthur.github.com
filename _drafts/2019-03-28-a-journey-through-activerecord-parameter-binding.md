---
layout: post
title: "A journey through ActiveRecord Parameter Binding"
description: "All sorts of things can be passed into a prepared statement in ActiveRecord. This post runs through the options."
category: TIL
tags: [til,technology,rails]
---

1. Intro and examples
2. Use cases - why to do this?
3. Code execution flow
4. Enumerable objects
5. `value_for_database`
6. `ActiveRecord::Base` object
7. Normal stringified options

ActiveRecord is probably the most broad-reaching and complex part of the Rails ecosystem. Despite
it's reputation for being full of magic smoke (especially once Arel gets involved), most of
ActiveRecord is relatively easy to understand, provided the scope of the research is carefully
controlled!

I was recently working with ActiveRecord::Relation scopes and was considering what, exactly, could
be passed to the `where` method. From my previous work, I knew that I had definitely passed hashes,
strings and other models as the 'value' part of the `where` statement. I also felt that I had passed
in other things as well - to be honest, for the most part this particular part of ActiveRecord had
"just worked" for me - I'd never really had a serious problem with it.

Nevertheless, the fact that I've basically been able to pass in just about anything into `where` got
me thinking about exactly what the logic is behind this method - what else can I pass in, and what
are the limitations?



* Anything that responds to `map` can be bound, except things that act like strings
* Objects can define `value_for_database` if they have a specific format they wish to represent themselves as
* Any ActiveRecord::Base object can be passed in to query by PK
* Anything else is basically stringifed

https://apidock.com/rails/v4.2.7/ActiveRecord/Sanitization/ClassMethods/quote_bound_value
https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/Quoting.html#method-i-quote
:qahttps://api.rubyonrails.org/classes/ActiveRecord/Sanitization/ClassMethods.html
