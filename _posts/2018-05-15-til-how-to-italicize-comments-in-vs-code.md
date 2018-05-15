---
layout: post
title: "TIL how to italicize comments in VS Code"
description: "I find italicized comments much easier to separate from code. I describe here the settings to activate this functionality in VS Code."
category: TIL
tags: [til,techology,tools]
---

Continuing my transformation of my development environment to match Wes Bos', today I discovered from a [Stack Overflow answer](https://stackoverflow.com/a/46278282) how to change how comments in any language are rendered in VS Code.

It turns out that there is a setting to control it, it's just deeply nested. The necessary snippet for user settings is:

``` json
"editor.tokenColorCustomizations": {
    "textMateRules": [
        {
            "scope": "comment",
            "settings": {
                "fontStyle": "italic"
            }
        }
    ]
}
```

(You can access user settings under "Code > Preferences > Settings" on Mac).

![Screenshot demo of italic comments](/img/posts/vscode-italic-comments.png)

It turns out that VS Code is yet another editor to [support](https://code.visualstudio.com/docs/extensions/themes-snippets-colorizers) themes and colour highlighting rules in TextMate format. Once we're into the correct setting context, it's just a case of targeting the `"comment"` scope and instructing the editor to render comments in italic. This should work for a bunch of other style properties as well, if there are other adjustments you'd like to make.