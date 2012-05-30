---
layout: post
title: "Import Trello cards from a CSV file"
description: ""
category:
tags: [code, open source]
---

This morning I wrote a quick script that I found quite handy - it takes a CSV file, and adds cards to Trello from it's contents. At [3months](http://3months.com), we quite regularly get long spreadsheets with requirements, so this script saves us a lot of time when we need to import these lists into cards so we can estimate and expand on them. Now, with a bit of reformatting, replacing proper quotes with double quotes, etc., I can just import in a couple of minutes.

<script src="https://gist.github.com/2839352.js?file=trello-cards-from-csv.rb"></script>

I've documented the script pretty well, but basically it uses the ruby-trello gem along with Foreman (for managing quite a few ENV variables that get passed around) to use an existing Trello OAuth authorization to add cards to a board and label them (since you may want to apply a 'from-spreadsheet' label or something like that). It probably won't handle special characters wonderfully, but the main thing is just to make sure that your CSV is a valid CSV file - escaped quotes, quoted columns etc.

I hope somebody else may find this useful!
