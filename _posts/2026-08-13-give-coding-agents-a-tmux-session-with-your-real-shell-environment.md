---
title: Give coding agents a tmux session with your real shell environment
category: TIL
---

> Note: Using tmux and other more-or-less built for agent multiplexers is a
> slightly different approach to the one I describe here - I'm talking about
> using tmux _from_ an agent instead of the agent running shell commands
> directly. Just saying that upfront to avoid confusion!

Coding agents spawn a fresh shell by default. That shell is usually set up
slightly differently than how I set up ones I use from my terminal.

mise lives in my `.zshrc`, along with Homebrew on the PATH and the Postgres
credentials I export there. A non-interactive agent shell often skips `.zshrc`
entirely. zsh only sources `.zshenv` unless you force it. So the agent gets
system Ruby, and `node` might not even be on the PATH. `PGHOST` isn't set
either. The agent can work away and resolve these issues itself, but it's
inefficient.

I don't want to teach every agent how to bootstrap my machine. I already have a
shell that's set up the right way. tmux lets me hand that shell over.

Start a detached session from a terminal that's already configured, in the
project directory. You can also use tools like `tmuxinator` to create a session
that's already seeded with the windows and panes you want:

```sh
tmux new-session -d -s agent -c "$PWD"
# or
tmuxinator my-project
```

The session inherits that terminal's environment. mise has already selected Ruby
and Node, and `PGHOST` is set, etc etc.

Then tell the agent to run commands in that session rather than its own
throwaway shell - for example, the agent can interact directly with tmux:

```sh
tmux send-keys -t agent 'bundle exec rspec' Enter
tmux capture-pane -pt agent
```

And I can attach while it's working:

```sh
tmux attach -t agent
```

I don't use this all the time. Mostly when I need a particular environment or
shell setup. Being able to attach to the agent's terminal and read the history
is a nice side effect.
