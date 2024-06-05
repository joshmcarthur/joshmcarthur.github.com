---
title: Stretching interactive elements
---

[Stretched links](https://getbootstrap.com/docs/5.3/helpers/stretched-link/)
have been a feature of Bootstrap for some time, but it's quite a useful
technique to understand, because the functionality it offers - expanding the tap
target of an element, works for _any_ element that can be interacted with with a
tap or mouse gesture, not just links. Some common examples include:

- Buttons
- Inputs
- Labels

The way that stretch links work is that they define a `::after` pseudo element,
and then use absolute positioning to have that pseudoelement fill it's
relatively positioned container (and the relative positioning _is_ a requirement
for this technique), using the following CSS:

```css
.stretched-link::after {
	position: absolute;
	bottom: 0;
	content: "";
	left: 0;
	right: 0;
	top: 0;
	z-index: 1;
}
```

The neat thing about using this technique is that whatever element the stretch
is applied to retains it's normal position and style. Because the pseudo element
is part of that element though, any interaction bubbles - so clicks,
double-clicks, drags, hovers, etc, all propagate. This makes this technique
really useful for:

- Cards (where the card has an unsurprising primary action)
- List items
- Droppable file inputs (to make the drop target bigger)

