---
layout: post
title: "Git commit message templates"
description: "Git allows a file-based template to be passed in to frame a commit message."
category: TIL
tags: [til,technology,git]
---

Writing high-quality git commit messages is one of the most responsible things you can do as a developer who cares to write considerate code that is well thought-out and easy to maintain. There's a great template for git commit messages that's floating around in a number of places. It's referred to the "Contributing to a Project" chapter of the [Git Book](https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project) and originally credited to [Tim Pope](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html). In short, a good template of a commit message is a short, one-liner summary of the code change, followed by the 'body' of the commit. The body of the commit may contain whichever links, bullet point or other emphasis required to communicate to the commit message reader the full context of the change.

While this is a good day-to-day commit message template to follow, there are some situations which might require additional contextual prompts to result in all the necessary information being communicated. Examples of such scenarios include:

1.  A commit resolving a bug ticket, where consistently communicating the ticket number, the URL of the ticket, and the requester.
2.  A commit layout out a particular architectural decision in a clear format, such as the model layed out in [Sustainable Architectural Design Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions).
3.  A commit implementing an agile story, where the developer may want to lay out the role and motivation of the feature.

While it's entirely posible to write these git commits ad-hoc as required, an additional option I discovered today was the ability to customize which template file is loaded when committing. As laid out on the [`git-commit man page`](https://git-scm.com/docs/git-commit), this option is:

```
-t <file>
--template=<file>
  When editing the commit message, start the editor with the
  contents in the given file.The commit.template configuration
  variable is often used to give this option implicitly to the
  command. This mechanism can be used by projects that want to
  guide participants with some hints on what to write in the
  message in what order. If the user exits the editor without
  editing the message, the commit is aborted. This has no effect
  when a message is given by other means,
  e.g. with the -m or -F options.
```

The trick is to combine this option with the ability to set up [Git aliases](https://git-scm.com/book/en/v2/Git-Basics-Git-Aliases) to make it easy to start commits using a particular template, for example:

```
git config --global alias.bugfix-commit 'commit --template=~/dotfiles/git/templates/bugfix-commit.txt'
```

Given a template that exists in that location, your `$EDITOR` will open with the contents of the template prefilled. Any lines beginning with a pound `#` can be used to provide instructions to the committer, and will be ignored from the final commit message.

As a final example, this is how I have set up a template for committing at key decision points:

My template in ~/.dotfiles/git/templates/commit-decision.txt:

```
# Write a useful commit message here:

# Now provide more information about why you've made this
# decision:
In the context of [USE CASE],
facing [CONCERN]
we decided for [OPTION]
to achieve [QUALITY],
accepting [DOWNSIDES].
```

My git alias:

```
git config --global alias.commit-decision 'commit --template=~/.dotfiles/git/templates/commit-decision.txt'
```

Usage:

![Gif example](http://g.recordit.co/JIqKkTuI8X.gif)
