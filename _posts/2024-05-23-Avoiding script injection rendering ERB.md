---
title: Avoiding script injection when rendering ERB
---

Bad (but not obviously so):

```ruby
data = { greeting: "Hello, world!" }
ERB.new("
  <h1>Show greeting:</h1>
  <p><%= greeting %></p>
").result_with_hash(data)

# => <h1>Show greeting:</h1> <p>Hello, world!</p>
```

The question is - what happens if `greeting` is something different...like `<script>alert('greeting!')</script>`? Perhaps, if you're used to Rails, not what you might expect:

```ruby
data = { greeting: "<script>alert('greeting!')</script>" }
ERB.new("
  <h1>Show greeting:</h1>
  <p><%= greeting %></p>
").result_with_hash(data)

# => <h1>Show greeting:</h1> <p><script>alert('greeting!')</script></p>
```

ERB is a templating language, but the content it expects is agnostic - it could be HTML, script, CSS, text...anything. Because of this, it doesn't perform any sanitisation or escaping for you.

One option here is to wrap everything in methods like `CGI.escapeHTML`, but in a Rails environment, it's much better (and safer!) to instead rely on Rails' existing rendering mechanisms!

Good:

```ruby
data = { greeting: "<script>alert('greeting!')</script>" }
ApplicationController.renderer.render(
  inline: "
    <h1>Show greeting:</h1>
    <p><%= greeting %></p>
  ",
  locals: data
)
# => <h1>Show greeting:</h1> <p>&lt;script&gt;alert(&#39;greeting!&#39;)&lt;/script&gt;</p
```
