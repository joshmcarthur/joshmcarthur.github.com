---
layout: post
title: "Calculating a SHA1 fingerprint for a file in Ruby"
description: "Fingerprinting a file is useful to reduce duplication or verify that a file has not been modified."
category: TIL
tags: [til,technology,ruby]
---

Fingerprinting a file isn't something I need to do super often, but it is useful to detect duplicates of files, or
verify that the file has not been changed (this can be useful for more than auditing and security - for example, it's particulalry
useful for caching, which is exactly why Rails' asset pipeline calculates hash digests for asset files when they are precompiled).

The manual approach to fingerprinting is to read the contents of the file (perform a buffered read for performance if you do this), but there's
actually a nice shortcut:

``` ruby
require "digest"

Digest::SHA1.file "/path/to/file"

# Example:
# fingerprint = Digest::SHA1.file Rails.root.join("public", "my-file.txt").to_s
```


