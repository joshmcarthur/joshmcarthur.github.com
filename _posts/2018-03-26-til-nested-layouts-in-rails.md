---
layout: post
title: "TIL: Nested layouts in Rails"
description: "TIL about how to create nested layouts in Rails."
category: TIL
tags: [til,rails,technology]
---

Nested layouts in Rails aren't a technique that I've had to use a lot in the past, but I'm finding myself using them quite a bit in my current work.

Nesting layouts allows for some sharing of a common view structure. The best example of this that I have come across is in the app I am working on. 
This app is about 50/50 Refinery CMS and normal Rails app. The Refinery pages are of several 'types' of content, but are all presented within the same container structure. The normal Rails app views are presented in a higher-level layout that has a little less markup surrounding it. 

Nesting layouts is actually quite easy. It uses the `content_for` method to declare content for a particular named block, and then render the layout that you wish to use. 

Here's an example:

``` erb
# app/views/layouts/application.html.erb
<html>
  <head>
    <title>My Rails App</title>
    <!-- Head content -->
  </head>

  <body>
    <nav>
      <h1>My navigation</h1>
    </nav>
    <%= content_for?(:content) ? yield(:content) : yield %>
    <footer>
      <small>Thanks for visiting</small>
    </footer>
  </body>
</html>
```

So, that's the normal application layout. The only difference is that the normal `yield` has a ternary operator wrapped around it to render content for `content`, if it is set. This is important to let our nested layout provide content to the application layout. 

Our nested layout looks like this:

``` erb
# app/views/layouts/content_page.html.erb
<% content_for :content do %>
  <h2>This is a content page</h2>
  <%= yield %>
<% end %>
<%= render template: "layouts/application" %>
```

This template provides content for the block named `:content`, and then renders the application layout. The app layout, seeing content in the `:content` block, renders this, rather than the implicit yield. 

Provided a controller declared the correct layout, e.g.

``` ruby
# app/controllers/pages_controller.rb
class PagesController < ApplicationController
  layout "content_page"
end
```

Then a pages controller view will be rendered inside the content page layout, resulting in a compiled ERB template of:

``` erb
<html>
  <head>
    <title>My Rails App</title>
    <!-- Head content -->
  </head>

  <body>
    <nav>
      <h1>My navigation</h1>
    </nav>
    <h2>This is a content page</h2>
    <%= yield %>
    <footer>
      <small>Thanks for visiting</small>
    </footer>
  </body>
</html>
```