---
title: Give FeaturePolicy a config object for env vars and user flags
category: TIL
---

On [Virtualtrails](https://virtualtrails.app) I check features through a
Pundit policy. Views call `feature?(:staff_tools)`,
`feature?(:secret_site)`, or `feature?(:native_bridge, context: app)`,
and `FeaturePolicy` has a method that returns true or false.

The first version put the whole answer in that method:

```ruby
def staff_tools?
  user&.admin?
end
```

Fine for "admins only". Then I needed a boolean I could flip without a
deploy, and a minimum app version so older native clients stay on the
old UI. Those aren't user checks. I didn't want every `feature?(:…)`
call to know whether it was reading env, a user record, or a version.

FeaturePolicy methods still return true or false. The enabled flags and
minimum versions come from `FeaturePolicy::Config`. Defaults in the
class are off. JSON in `FEATURE_POLICY_CONFIG` deep-merges over them.

```ruby
class FeaturePolicy::Config
  ENV_KEY = "FEATURE_POLICY_CONFIG"

  DEFAULTS = {
    native_bridge: {
      minimum_version: { ios: nil, android: nil }
    },
    secret_site: {
      enabled: false
    }
  }.freeze

  def initialize
    @data = DEFAULTS.deep_dup.deep_merge(env_overrides)
  end

  def enabled?(feature)
    ActiveModel::Type::Boolean.new.cast(@data.dig(feature.to_sym, :enabled))
  end

  def minimum_version(feature, platform)
    return nil if platform.blank?

    coerce_minimum_version(@data.dig(feature.to_sym, :minimum_version, platform.to_sym))
  end
end
```

`staff_tools?` still looks at the user. `secret_site?` is the boolean.
`native_bridge?` compares `record.version` (whatever you passed as
`context:`) against the configured minimum:

```ruby
def staff_tools?
  user&.admin?
end

def secret_site?
  self.class.config.enabled?(:secret_site)
end

def native_bridge?
  min = self.class.config.minimum_version(:native_bridge, record.platform)
  min.present? && record.version >= Gem::Version.new(min)
end
```

The env JSON looks like this:

```json
{
  "native_bridge": {
    "minimum_version": {
      "ios": "21",
      "android": "15"
    }
  },
  "secret_site": {
    "enabled": true
  }
}
```

Unknown keys stay in the merged hash, so I can put a value in the
environment before the code that reads it is deployed. Invalid JSON or
a junk version string logs a warning and uses the defaults. A typo
turns the feature off. It does not raise in a request.

If I add another source later, I'd merge it into `@data` next to the
env JSON. Call sites keep saying `feature?(:secret_site)`.
