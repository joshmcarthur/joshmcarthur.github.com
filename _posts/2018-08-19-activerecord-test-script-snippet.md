---
layout: post
title: "Pattern for testing ActiveRecord ideas in a standalone script"
description: "This script is cobbled together from a number of sources to make testing a particular model/association structure easy"
category: TIL
tags: [til, technology, rails]
---

This code snippet is a reusable pattern for testing out a model/association structure
in ActiveRecord to see whether it's worth proceeding with. The snippet covers installing
necessary dependencies, setting up an in-memory SQLite3 database, and loading a database
schema into this database.

The example included in the pattern was prepared to demonstrate a has many through association
between users and other users that are followed.

{% gist fda80a4b138e393608d9ad43aa093be1 %}
