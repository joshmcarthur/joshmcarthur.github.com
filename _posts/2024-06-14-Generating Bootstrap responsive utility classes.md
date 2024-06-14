---
title: Generating responsive utility classes with Bootstrap
---

I'm a big fan of Bootstrap, I use it a lot. I've used it for many years, and
with the recent support for theming with CSS variables, and for their utility
API, I've found I can have the best of both worlds - a rich and capable library
of components, along with an extensive class-based approach for making tweaks to
elements and components.

One of the neat things about the utility API is that it's generated from a SASS
map. This means that the map can be manipulated before generation to affect
which utilities are generated, and how they are generated.

There are _lots_ of things that can be done with this manipulation, but in this
case I'm going to talk about adding a single option to a utility: `responsive:
true`. This will generate a variant of each utility class for each breakpoint
(which are themselves configurable).

As an example, Bootstrap defines a range of text color utility classes -
`text-danger`, `text-dark`, `text-light`, etc - all the colours defined in
`$utilities-text-colors`, plus some options for `muted`, `emphasis`, etc. The
utility definition is in the utilities map:

```scss
$utilities: (
  // ...
  "color": (
      property: color,
      class: text,
      local-vars: (
        "text-opacity": 1
      ),
      values: map-merge(
        $utilities-text-colors,
        (
          "muted": var(--#{$prefix}secondary-color), // deprecated
          "black-50": rgba($black, .5), // deprecated
          "white-50": rgba($white, .5), // deprecated
          "body-secondary": var(--#{$prefix}secondary-color),
          "body-tertiary": var(--#{$prefix}tertiary-color),
          "body-emphasis": var(--#{$prefix}emphasis-color),
          "reset": inherit,
        )
      )
    ),
    // ...
);
```

[Source](https://github.com/twbs/bootstrap/blob/d2d4581790da2618d3fe063dafaa6205c73aabdd/scss/_utilities.scss#L576)

You'll notice that this map is missing the `responsive` option. This can be
added by manipulating the `$utilities` map. This needs to be done _after_
importing `bootstrap/scss/utilities` (so that the map is actually defined), but
_before_ importing `bootstrap/scss/utilities/api` (so that the map changes are
reflected in the generated classes):

```scss
@import "bootstrap/scss/utilities";

$utilities: map-merge(
  $utilities, (
    "color": map-merge(
      map-get($utilities, "color"),
      ( responsive: true )
    )
  )
);

@import "bootstrap/scss/utilities/api";
```

With this option added, we can now apply normal responsive modifiers to our
`text-` color classes. As an example: `.text-danger.text-lg-success` will color
the element these classes is applied to to red (#dc3545 by default) up to large
screens (992px by default), then to green (#198754 by default).

This is a somewhat convoluted example, but the takeway is more significant - in
the same way that the responsive option can be added, any other parts of the map
can be added, or removed, or changed - including class names, values, and other
options like `print: true` (generates modifier classes for in print mode, for
example `d-print-none` will hide an element with print media).
