---
title: A simple redirect to next pattern for Rails
category: TIL
---

In Rails controllers, it's pretty common to redirect somewhere when an action is completed. Sometimes this location is unknown, and therefore straightforward. Other times I just want to redirect 'back' - wherever that might have been - `redirect_back(fallback_location: wherenver_path)` is perfect for that.

Occasionally though, I'll want to determine the next path from the caller - often this will be for some sort of generic or shared action, that might need to go one of several places when it's done. For that, I like to use this simple `redirect_to_next` pattern:


```ruby
module RedirectToNext
  extend ActiveSupport::Concern

  def redirect_to_next(fallback_location:, **args)
    return redirect_to fallback_location, **args unless next_path

    redirect_to params[:next], **args
  end


  def next_path
    return nil unless params[:next]&.start_with?("/")

    params[:next]
  end
end

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include RedirectToNext

  # in a controller
  def create
    # ...
    redirect_to_next(fallback_location: whatever_path, notice: "Created a thing")
  end
end
```

This pattern essentially follows the logic of `redirect_back`, but sources the redirect location from a param called `next`. The param should be a path (though Rails prevents other-host redirects now by default anyway). It splats other args so that anything that can be passed to `redirect_to` is forwarded.

The usage of this is nice and simple. For controllers that are POSTed to directly, I just provide the `next` param with the path to send to. For `new` actions, I include the `next` param as a hidden field:

```erb
<%= form_with model: @widget do |f| %>
   <%= hidden_field_tag :next, whatever_path %>
   <%= f.label :name %>
   <%= f.text_field :name %>
   <%= f.submit >
<% end %>
```


