---
layout: post
title: "List filenames only with grep"
description: "Quickly list files with a match"
category: TIL
tags: [til,technology,shell]
---

Just a quick one - I use `grep` all the time to find matches for text in files. Sometimes I'm not
really interested in exactly what matched, I just need a list of files that matched SOMEWHERE. This
morning I found that the `-l` option with this (or `--files-with-matches`). 

From the man page:

```
 -l, --files-with-matches
          Suppress  normal  output;  instead  print the name of each input
          file from which output would normally have  been  printed.   The
          scanning  will  stop  on  the  first match.  (-l is specified by
          POSIX.)
```

Which turns the output from:

```
app/views/widgets/forms/_basics.html.haml:    = f.input :description, as: :text, input_html: { rows: 3, class: "xxlarge tinymce", id: "textarea-widget" }
app/views/widgets/_edit_form_description.html.erb:<%= f.input :description, input_html: { class: "tinymce xxlarge" } %>
app/views/widgets/_edit_form_description.html.erb:<%= f.input :blurb, input_html: { class: "tinymce xxlarge" } %>
```

Into:

```
app/views/widgets/forms/_basics.html.haml
app/views/widgets/_edit_form_description.html.erb
```

Handy!
