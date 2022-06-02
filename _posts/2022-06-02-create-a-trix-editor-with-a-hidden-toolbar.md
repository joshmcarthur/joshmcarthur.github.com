---
layout: post
title: "Create a trix editor with a hidden toolbar"
description: "How to render a trix editor without a toolbar"
category: TIL
tags: [til,rails,actiontext,trix]
---

[Trix](https://github.com/basecamp/trix) is fairly new to me, but now that it's
closely integrated with Rails, it's become by go-to for rich text editing.

I've been working on a project where I wanted a text field with some basic rich
text capabilities, but I wanted the input to look like a normal textarea. This
would allow standard text entry, but allow users to use keyboard shortcuts to
specify bold, italic and underlined text.

I came across [this issue](https://github.com/basecamp/trix/issues/28), which
let me to a [test
fixture](https://github.com/basecamp/trix/blob/main/test/src/test_helpers/fixtures/editor_with_toolbar_and_input.jst.eco#L3)
which gave the pointer I needed to do this. If we create our own
`<trix-toolbar>` element, _and hide it_, then Trix will use this toolbar, but it
will remain hidden.

```
<trix-toolbar id="hidden_trix_toolbar" style="display:none;"></trix-toolbar>
<trix-editor toolbar="hidden_trix_toolbar" input="text_input"></trix-editor>
<input type="hidden" id="text_input" />
```


