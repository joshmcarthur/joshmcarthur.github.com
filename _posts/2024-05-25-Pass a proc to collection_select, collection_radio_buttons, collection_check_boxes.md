---
title: Procs can be passed to Rails' collection form helpers
---

Just a quick little way to reformat or otherwise transform a value to be used as the label
in a select, radio button, or checkbox collection group in a Rails form:

Given I have an enum defined like so:

```ruby
class User
  enum :distance_unit, { mi: "mi", km: "km" }
end
```

And translations defined like so:

```yaml
en:
  distance_units:
    km: Kilometer (Metric)
    mi: Mile (Imperial)
```

Then I can pass a short proc as the 'label' argument to a `collection_*` form helper, which allows the value to be transformed:

```erb
<%= f.collection_radio_buttons :distance_unit,
                               User.distance_units.keys, :to_s, ->(val) { t("distance_units.#{val}") } %>
```

Note: This also works to transform the ID argument as well, however normally the model or object already has a method which can be passed by symbol to identify the value.
