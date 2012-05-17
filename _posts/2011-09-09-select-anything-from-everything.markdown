---
title: "Select Anything From Everything with Select"
layout: post

type: regular
comments: true
---


I was recently called upon to make a horrible select input for a Ruby on Rails project - essentially, there was this model, let's call it a Snafu, and one Snafu could share an attachment to any number of models.

This select was difficult because I couldn't just have a selection of record ID's - I would have to use both the model type **as well as** the model ID in order to be able to track down these records when the form was submitted. Here's how I did it:

**Step 1: Rendering the select **
First of all, we need to render a selection box for the 'New Snafu' form. This selection box should be populated by a number of model collections, keyed by an identifier that specifies both the model name and the model ID. Time for a model method, and a helper!

{% highlight ruby %}
    def options_for_select_anything(selected = nil)
     #Make a hash of the things we want to select from
     options = {
      'Foo' => Foo.active.map(&item_for_select_anything),
      'Bar' => Bar.active.map(&item_for_select_anything)
     }
     #Use a Rails helper to actually get the tags
     grouped_options_for_select(options, selected)
    end

    def item_for_select_anything
     # Return an array of the record name and the identifier we want to use
     # The record name in this case is the display value, while the identifier
     # is the data value
     lambda { |record| [record.name, "#{record.id}-#{record.class.name}"] }
    end
{% endhighlight %}

Now that we have these helpers, we have a grouped collection of options, in which each option tag within the select will look something like '`<option value="1-Foo">Foo #1</option>`' - let's render our select.

{% highlight erb %}
	<% form_for @snafu do |form| %>
		<p>
			<%= form.label :item_identifier, 'Item' %><br />
			<%= form.select :item_identifier, options_for_select_anything %>
		</p>
		<p>
			<%= form.submit 'Create' %>
		</p>
	<% end %>
{% endhighlight %}

This is a basic form of course - your form will have all the other attributes you need, but the key thing to notice here is that we aren't trying to load against our Polymorphic 'item' association within the form - instead, we're just going to send through a 'item_identifier' parameter that we can use to *find* the item in our model. Let's take a look at the sections we need.

First of all, we need to have the Polymorphic association in our model, if you haven't already done this.

{% highlight ruby %}
	# Snafu.rb

	class Snafu < ActiveRecord::Base
		# Snip
		belongs_to :item, :polymorphic => true
		# Snip
	end

	# Migration
	add_column :snafus, :item_id, :integer, :null => false
	add_column :snafus, :item_type, :string, :null => false

{% endhighlight %}

Next of all, we need to add an `attr_writer` to our model - this will hold the 'item_identifier' from our form submission until we are ready to use it.

{% highlight ruby %}
	# Snafu.rb

	attr_writer :item_identifier
{% endhighlight %}

Finally, we need to add a `before_validation` filter to associate the record identified by our item_identifier with our model instance:

{% highlight ruby %}
	# Snafu.rb
	class Snafu < ActiveRecord::Base
		# Snip
		belongs_to :item, :polymorphic => true
		before_validation :set_item

		attr_writer :item_identifier

		# Snip

		private

		def set_item
			if self.item_identifier
			id, model = self.item_identifier.split('-')
			self.item = Kernel.const_get(model).send(:find, id) rescue nil
		end
	 end
{% endhighlight %}


Let's take a look at what we've done there - really, the meat of it is in our set_item method, that gets called before validations run (so that we will have a real item set before we may need to run validations on that item). First of all, set_item checks that we have set a item_identifier - if we haven't we don't want to run into Nil exceptions! Given an item_identifier is present, we want to split our identifier (Remember, this is in the format id-class name), into two parts. Finally, we do a little Ruby magic to get the class using Kernel.const_get, and then call `find` on it with the ID that we want. If anything goes wrong with this bit (The class not existing, for example), then we just set item to nil.

There we have it then - it's a horrible situation, but I feel like it's a pretty good approach. The logic is where it should be (models and helpers), the views and controllers feel clean, and it's flexible to be reused pretty easily.

As a final tweak, there's one more change you may want to make - that is setting the selected item when we return to our form. If you take a look at the helper method we defined above, you'll notice that we already support a selected option - we just need to pass this in. To do this, we want to add a method to our 'Snafu' class that will return a string of the item id and the item name concatenated with a dash - i.e., the format that our select box in the form is expecting. Go ahead and add the method now:

{% highlight ruby %}
	# Snafu.rb

	def item_identifier
		# Return the owner_identifier set using the attr_writer, if it exists
		return @owner_identifier if @owner_identifier

		# Otherwise, try and build it from the current item saved against the model
		[self.item.id, self.item.class.name].join('-') if self.item.present?
	end
{% endhighlight %}

With that method, can can just change our select input in the form to make use of this value:

{% highlight erb %}
	# new.html.erb
	# Snip
	<%= form.select :item_identifier, options_for_select_anything(form.object.item_identifier) %>
{% endhighlight %}

There we are! Now when we show the form, the selected item will appear, just as we wanted.

