---
title: Streamlining daily blog posts
---

For quite a while, I managed to find something interesting to write up each work
day. Unfortunately, life got in the way, and as is easy to do, this habit
stopped.

I'm hoping to get back into writing, and I'm trying to do this by making it
easier to write up a post without leaving my flow as much. To help with this, I
set up this shell script:


```bash
#!/bin/bash

blog-post() {
    # Check if title argument is provided
    if [ -z "$1" ]; then
        echo "Please provide a title for the blog post."
        exit 1
    fi

    # Save the title
    title="$1"

    # Change directory to your blog directory
    cd ~/Projects/github.com/joshmcarthur/joshmcarthur.github.com

    # Create a new blog post markdown file
    make post title="$title"

    # Generate the file name
    file_name="_posts/$(date +"%Y-%m-%d")-$title.md"

    # Open the new post in VSCode with --wait argument
    code --wait "$file_name"

    # Commit and push changes after VSCode is closed
    commit_and_push "$file_name"
}

# Function to commit and push changes to GitHub
commit_and_push() {
    file_name="$1"

    # Add all changes
    git add "$file_name"

    # Extract the post title from the file name
    post_title=$(basename "$file_name" | sed 's/^[0-9]*-//' | sed 's/\.md$//')

    # Commit changes with post title and current date
    git commit -m "Updating $post_title - $(date)"

    # Push to GitHub
    git push origin master
}

# Call create_post function with title argument passed from command line
blog-post "$@"
```

This script will switch to my blog, and create a new post file, then open VSCode
with `--wait`, which means it waits for the editor to be closed before returning
to the calling script. Once this happens, it will commit and push the post
automatically. Any corrections or updates, I'm happy to do as a subsequent
commit.

I've added this to my dotfiles bin/ folder, and chmod +x'd it so I can call it
from anywhere. It's ready to go!
