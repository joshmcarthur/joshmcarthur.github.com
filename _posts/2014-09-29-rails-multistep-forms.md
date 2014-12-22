---
layout: post
title:  "Multistep form validations with Rails and Wicked"
date:   2014-12-22 13:00:00
---

> Note: This blog post was originally posted at the [Rabid Brains blog](http://brains.rabid.co.nz/2014/09/29/rails-multistep-forms.html) (my employer's blog).

Multistep forms are the bane of the developer's existence. No matter how you cut it, the fact that multiple request/response cycles are required to create a single resource goes against the grain of a whole bunch of acronyms representing fairly popular patterns and specifications (e.g. HTTP). Despite that, they're a pretty well established usability pattern when you just have a tonne of information to collect and not much space to do it in, so it's well worth keeping a method on hand to throw these types of forms together when it's gotta be done.

<!--break-->

In this post, I'm going to talk about how to create a multi-step form process in Ruby on Rails without throwing all that the framework can offer out the window. In particular, I'm going to discuss the structure the form controller can take, and how to perform incremental validations to provide useful feedback to users as they move through the fields. If you'd rather just look through the code, I've developed a demo application using the instructions in the blog post. You can check out [the source code](https://github.com/joshmcarthur/multistep-blog-demo), or [the application on Heroku](https://jm-multistep-blog-demo.herokuapp.com/).

First of all, I suggest that you don't set out and try and build the logic for managing the form steps yourself. This part in particular can end up quite messy in Rails, and is always consistent between applications, making it prime for extraction into a Rubygem. Luckily for us, a stable, maintained gem named [wicked](https://github.com/schneems/wicked) exists that includes this exact behaviour. Use the gem, read the README, and be glad that your controllers can remain free of the numerous helpers you would otherwise have to write to manage and move between steps.

With Wicked installed, you're all set to create your controller structure. The key thing to realise here is that if you are adding a multistep form, you are really creating a first-class resource in your application - at least, as far as your controllers are concerned. What I'm getting at here is that you musn't try and shoehorn the controller actions you will be adding to your controller for your _model resource_ - the fact that there are multiple steps being presented, and different fieldsets being submitted, justifies an individual controller to contain all this logic.

Let's say the top-level resource is named `Pet`. We'll go into the attributes of the `Pet` model in just a minute, but for now, that tells us that our top-level resource controller should be named `PetsController`, and be routed like so:

``` ruby
# config.routes.rb
resources :pets, only: [:new, :create, :show, :index]
root to: 'pets#index'
```

Now we have a controller for managing our `Pet` resource, we now need to create a controller for managing our `Pet` resource _form_. For clarity, this should probably be in it's own namespace (otherwise, you'll have a fairly generic-looking `FormStepsController`). You can call this controller whatever you like, but something representative of what it does would be most useful - perhaps `Pet::FormStepsController`, `Pet::StepsController`, or something more high-level, such as `Pet::BuildController`. For the rest of this post, I'm going to use `Pet::StepsController`, but you can use what you like - just be sure to make appropriate replacements when necessary. Let's create that controller now:

``` bash
./bin/rails generate controller pet/steps_controller show update
```

You'll notice that I've generated the controller with just two actions - `show` and `update`. This is actually all you need for this form - remember, Wicked is handling the step logic for us, and this controller is responsible for a form step, not the resource. This means that our actions map to `show`-ing a form step, and `update`-ing the record with the attributes for that step. Let's add the routes for this new controller now - remember, it will be nested within our top-level resource controller:

``` ruby
# config/routes.rb
resources :pets, only: [:new, :create, :show, :index] do
  resources :steps, only: [:show, :update], controller: 'pet/steps'
end

root to: 'pets#index'
```

Notice how we can still use `resources` with our new controller? Rails is going to cleverly pass through the form step in the `:id` parameter for this route, as this identifies _which_ step to `show` or `update`. So, the route to a form step with these routes will look like this:

`/pets/1/steps/identity` - where `1` is the `:pet_id`, and `identity` is the `:id`. Nice!

Now that we've got our controller structure set up, let's leave this area for now and go take a look at our `Pet` model - this is where we'll set up our form steps, and tweak our validation to let us just check validity for a particular step.

---

Let's say (for the purposes of having a model complex enough to justify multiple steps), our `Pet` model has the following schema:

``` ruby
 create_table "pets", force: true do |t|
    t.string   "name"
    t.string   "colour"
    t.string   "owner_name"
    t.text     "identifying_characteristics"
    t.text     "special_instructions"
    t.datetime "created_at"
    t.datetime "updated_at"
  end
```

We're going to have three form steps for this model - 'identity' (which will collect name, and owner_name), 'characteristics' (which will collect identifying_characteristics and colour), and 'instructions' (which will collect special_instructions). We'll define a [class-level accessor](http://apidock.com/rails/Class/cattr_accessor) for holding our form steps:

``` ruby
# app/models/pet.rb
class Pet < ActiveRecord::Base
  cattr_accessor :form_steps do
  	%w(identity characteristics instructions)
  end
end
```

Now we can access our form steps using the following method call: `Pet.form_steps`.

Next, let's set up our validations. We'll be requiring that all the fields be filled in, but only if you're on the appropriate step. To check this, we need to implement a method that checks whether certain validations should be run based on what step we're on. The validation check isn't too simple - it's not enough to just check the current step, because validations should still be run on previous steps, and if the current form step is nil. Let's go ahead and implement that method now:


``` ruby
# app/models/pet.rb

def required_for_step?(step)
  # All fields are required if no form step is present
  return true if form_step.nil?

  # All fields from previous steps are required if the
  # step parameter appears before or we are on the current step
  return true if self.form_steps.index(step.to_s) <= self.form_steps.index(form_step)
end
```

...hang on a minute - how do we know what form step we're on at the moment? We don't! Let's add an [instance-level accessor](http://apidock.com/ruby/Module/attr_accessor) to our model to store the current form step:

``` ruby
# app/models/pet.rb
class Pet < ActiveRecord::Base
 # ...

 attr_accessor :form_step

 # ...
end
```


Great! Now we can detect whether we need to run validations for a set of attributes or not, based on which step we're on. Conveniently, Rails allows us to pass in an `if` option to each validation that determines whether it should be run or not. We could implement the validations for the first step like so then:

``` ruby
validates :name, :owner_name, presence: true,
		  if: -> { required_for_step?(:identity)
```

We can go ahead and implement the validations for the other steps the exact same way - I'll leave that as an exercise to the reader.

Before we head back to our controller, I'm just going to make a very brief suggestion. If you're building a multistep form yourself your validations are likely to be multiple lines for each step, and possibly even for each attribute. If you do find yourself having to do that, I would encourage you to look into the [with_options helper](http://apidock.com/rails/Object/with_options) - this will let you define your `if` option in a single place, and then apply all the validations within the block. Here's an example, showing each of the attributes for the first step on individual lines:

``` ruby
with_options if: -> { required_for_step?(:identity) do |step|
  step.validates :name, presence: true
  step.validates :owner_name, presence: true
end
```

As you can see, it's overkill for one-liner, simple validations, but it's quite a nice syntax if you've got more complex rules.

When we last looked at our controller, it had been generated with two actions - `show` and `update`. Now it's time to add Wicked to our controller, and implement our actions.

The first, and most obvious thing to do, is to include Wicked's helpers into our controller - as per their README:

``` ruby
class Pet::StepsController
  include Wicked::Wizard

  def show
    # TODO
  end

  def update
    # TODO
  end
end
```

Once that's done, we need to tell Wicked what our form steps are. Now, the README suggests putting this into the controller, but we've already gota collection of our form steps that we can access in our model. Let's just use that!

``` ruby
class Pet::StepsController
  include Wicked::Wizard
  steps *Pet.form_steps

  # ...
end
```

Now our controller is set up to use Wicked, and knows which form steps to use. There's just one more thing we need to consider before we can test this out - how do we get into our wizard form? Remember, our routes rely on having a `Pet` ID already present, so we're going to need to create our Pet instance before we enter the wizard form.

The most appropriate place to implement this is back in our top-level controller. Remember, our wizard controller is responsible for showing and updating steps, but our top-level controller is still responsible for managing our `Pet` models. Semantically, this means that our `create` action of our `PetsController` should create the new `Pet` instance. This action will work a little differently from a normal `create` action that you might be used to, as it doesn't strictly need a `new` action - we won't be saving this `Pet` model with any data - just putting it in the database so that our `StepsController` can access that.

Your create action can be as simple as this:

``` ruby
class PetsController < ApplicationController
  # ...

  def create
    @pet = Pet.new
    @pet.save(validate: false)
    redirect_to pet_step_path(@pet, Pet.steps.first)
  end

  # ...
end
```

In other words, create a new pet with no data, and redirect to the first step.
If you would like a new action, you can of course add one - this could render a view that explains the form steps, or something similar to that. It's not required for this controller to work correctly though - you can just point any links to create a new pet straight to the `create` action like so:

``` erb
  <%= link_to 'Record a Pet', pets_path, method: :post %>
```

So, that will handle creating a new Pet for us, and will redirect to the start of the form. We haven't implemented our `show` action yet though - let's do that now.

Our show action needs to find the pet (so that we can use `form_for @pet` in our templates), and then call a special Wicked method called `render_wizard` - this will render a template with the same name of our step - for example, if we are on the `identity` step, this will render "app/views/pet/steps/identity.html.erb". Here's what the show action looks like:

``` ruby
class Pet::StepsController < ApplicationController

  def show
    @pet = Pet.find(params[:pet_id])
    render_wizard
  end

  def update
    # TODO
  end

end
```

Before we give this a test, let's quickly implement the template for the first form step:

``` erb
# app/views/pet/steps/identity.html.erb
<%= form_for @pet, method: :put, url: wizard_path do |f| %>
  <% if f.object.errors.any? %>
    <div class="error_messages">
      <% f.object.errors.full_messages.each do |error| %>
        <p><%= error %></p>
      <% end %>
    </div>
  <% end %>

  <fieldset>
    <legend>Pet Identity</legend>

    <div>
      <%= f.label :name %>
      <%= f.text_field :name %>
    </div>

    <div>
      <%= f.label :owner_name %>
      <%= f.text_field :owner_name %>
    </div>

    <div>
      <%= f.submit 'Next Step' %>
    </div>
  </fieldset>
<% end %>
```

If you visit your first form step now, you should see your identity form. If you see this - congratulations! If you don't, go back and check that your routes are all correct - remember you need to access the wizard form using a Pet ID that exists in the database.

We can view the form now, but if you try and hit save, you'll notice you run into an error. This is because we have not yet implemented our `update` action. This action is actually going to be very simple, because Wicked handily takes up all the heavy lifting of working out where we need to go next in our form. Let's implement this, pretty much based off the Wicked README:

``` ruby
# app/controllers/pet/steps_controller.rb
class Pet::StepsController < ApplicationController
  # ...

  def update
    @pet = Pet.find(params[:pet_id])
    @pet.update(pet_params(step))
    render_wizard @pet
  end

end
```

We're using `render_wizard`, just like we did in the `show` action, but this time we're passing it an object. In this case, Wicked will check the object - if it is valid, it will continue to the next step, but if it is invalid, it will not move onto the next step, but re-render the template for the current step (where errors will be shown as appropriate if you are rendering the error messages like the `identity` template above).

This looks good, but you may have noticed that we've introduced another new method - this one's to do with [strong parameters](http://edgeguides.rubyonrails.org/action_controller_overview.html#strong-parameters). If you cast your mind back to when we were working on our model, you may also remember that our conditional validations rely on having the `form_step` set in the model to work correctly, and we're not setting that anywhere here. Luckily, we can fix both of these problems by implementing the `pet_params` method!

This method will use a "case/when" statement (I've found [Alan Skorkin's blog post to be a good summary of case/when if you need a refresher](http://www.skorks.com/2009/08/how-a-ruby-case-statement-works-and-what-you-can-do-with-it/)) to return the different `Pet` attributes that can be updated based on the step that is passed in. It will also 'mix-in' the current form step to the parameters it returns so that the model knows which step it is on and can run validations accordingly.

Here's the implementation:

``` ruby
# app/controllers/pet/steps_controller.rb
class Pet::StepsController < ApplicationController
  # ...

  private

  def pet_params(step)
  	permitted_attributes = case step
  	  when "identity"
  	    [:name, :owner_name]
  	  when "characteristics"
  	    [:colour, :identifying_characteristics]
  	  when "instructions"
  	    [:special_instructions]
  	  end

  	params.require(:pet).permit(permitted_attributes).merge(form_step: step)
  end

end
```

As an example, were this to be called with the first step, it would return: `{name: 'Tinkerbell', owner_name: 'Bob Jones', form_step: 'identity'}`. It will raise an error and return an appropriate status code if someone attempts to submit an attribute that is not allowed on the current step.

We now have our model set up to perform validations for whichever step we are up to, and our controller set up with `Wicked` to manage working through the steps. Our form is not yet complete - we are still missing templates for the "characteristics" and "instructions" steps, but the implementation of those is left as an exercise - they will very much resemble the template for the "identity" step, just with different fields.

In terms of where you go from here, there's plenty of scope for improvement! There is some code in our steps controller that can be refactored to not be repeated, and you might want to split some of the common elements in your step templates into partials (for example, the submit button and/or the error rendering). You might also want to tweak when validation errors should/shouldn't be run (as an example of this, I have implemented a variant of this form where validations are not run until the final step). You may also want to check out the following resources:

* Demo application developed using this blog post: [App](http://jm-multistep-blog-demo.herokuapp.com/), [Source](https://github.com/joshmcarthur/multistep-blog-demo)
* [Ryan Bates' Railscast on Wicked](http://railscasts.com/episodes/346-wizard-forms-with-wicked)
* [Wicked README](https://github.com/schneems/wicked)
