---
title: Bind XPath variables in Nokogiri instead of string interpolation
category: TIL
---

When you look up XML nodes by attribute value in Nokogiri, it's tempting to
interpolate the value straight into the XPath:

```ruby
doc.at_xpath("//item[@id='#{id}']")
```

That works when `id` is predictable. It's shakier when the value comes from a
user upload, an API payload, or anything else you don't control. A value like
`foo" or @id="bar` can break out of the string literal and match a different
node than you meant. Same idea as SQL injection, just with XPath.

I ran into this parsing a DOCX file, looking up a `w:styleId` in
`word/styles.xml`. Same fix regardless of where the XML came from.

I didn't know Nokogiri could bind variables into XPath, but it can! 
Pass the value as a keyword argument and reference it in the query with
`$variable_name`:

```ruby
doc.at_xpath("//item[@id=$id]", id:)
```

With a namespace map, as you often need for Word documents:

```ruby
doc.at_xpath("//w:style[@w:styleId=$style_id]", W, style_id:)
```

The crafted example is now treated as a literal string. Nothing matches, so you
get `nil` back instead of the wrong node.

This works with `xpath`, `at_xpath`, and anything else that accepts a bindings
hash as the last argument. Worth remembering whenever you're building XPath
from external input. DOCX is just a ZIP full of untrusted XML, after all.
