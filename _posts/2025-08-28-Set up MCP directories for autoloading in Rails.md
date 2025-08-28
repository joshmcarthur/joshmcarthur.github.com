---
title: How to set up Rails directories for MCP servers
category: TIL
---

I've recently started on a new Rails application which will define at least one
MCP servers, and potentially 2-3. To support this, I wanted to set up a new
namespace in my `app/` folder to contain all the MCP 'stuff' - I also do the
same thing for GraphQL mutations, resolvers, queries etc.

Zeitwerk has made autoloading and eager loading much easier in Rails, but this pattern is still something I always have to figure out - I want an `app/mcp` folder, and I want all the constants in that tree to sit within the `MCP` module.

So a folder structure like:

```
app/
|
├── mcp
│   ├── prompts
│   │   └── base_prompt.rb
│   ├── README.md
│   ├── resources
│   │   └── base_resource.rb
│   ├── servers
│   │   └── base_server.rb
│   └── tools
│       └── base_tool.rb
```

Defines constants named like `MCP::Servers::BaseServer`.

The magic for this is to tell Rails' autoloader about a new top level directory and the namespace to use:

```ruby
# config/application.rb
# Autoload and reload these paths in dev, eager load in production
Rails.autoloaders.main.push_dir(
  Rails.root.join("app/mcp"),
  namespace: "MCP"
)
```

With this in place, both autoloading, dev reloading and eager loading all work as expected:

```ruby
require "test_helper"

class MCPAutoloadTest < ActiveSupport::TestCase
  test "MCP classes are autoloaded correctly" do
    assert MCP::Servers::BaseServe`
    assert MCP::Tools::BaseTool
    assert MCP::Prompts::BasePrompt
    assert MCP::Resources::BaseResource
  end
end
```