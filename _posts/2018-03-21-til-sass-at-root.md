---
layout: post
title: "TIL: SASS @at root"
description: "The @at-root directive can make it easier to generate nicer stylesheets"
category: til
tags: [til,sass,technology]
---

The `@at-root` directive can be quite useful for creating SASS rules where you need 
to jump outside of a SASS scoping block back to the root level when your styles are compiled.

In particular, this directive can be useful for generating [BEM](http://getbem.com/) styles, since the `&` abbreviation
continues to work for targeting the parent selector. 

Here's an example of a component without `@at-root`:

``` sass
.button {
  &.collapse-to-icon {
    padding: 1rem;
    &__text { display: none; }
    &__icon { display: inline-block; }
  }
}
```

Which is compiled to:

``` css
.button.collapse-to-icon {
  padding: 1rem;
}

.button.collapse-to-icon .button.collapse-to-icon.collapse-to-icon__text {
  display: none;
}
.button.collapse-to-icon .button.collapse-to-icon.collapse-to-icon__icon {
  display: inline-block;
}
```

The problem with this CSS is that because of the parent nesting, unnecessary conditions
are prefixed onto the elements of the `collapse-to-icon` block. 

With `@at-root`, something like this can be written:

``` sass
.button {
  &.collapse-to-icon {
    padding: 1rem;
    @at-root {
      &__text { display: none; }
      &__icon { display: inline-block; }
    }
  }
}
```

Which is compiled to:

``` css
.button.collapse-to-icon { 
  padding: 1rem;
}

.collapse-to-icon__text {
  display: none;
}

.collapse-to-icon__icon {}
  display: inline-block;
}
```


