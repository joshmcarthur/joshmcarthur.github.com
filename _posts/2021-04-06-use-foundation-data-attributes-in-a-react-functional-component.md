---
layout: post
title: "Use Foundation data attributes in a React functional component"
description: "How to support Foundation JS in a React functional component"
category: TIL
tags: [til,frontend, technology,react]
---

I've been porting some previously server-rendered Rails templates to instead sit
within a React application. This particular application uses [Foundation
Sites](https://get.foundation/sites) for base styles, and uses some of
Foundation's components which use Javascript to function - mostly basic stuff
like `data-dropdown`, `data-accordion`, `data-tabs`. Foundation (_still_) uses
jQuery for setting up these elements, and by default, initializes based on the
`ready` event. This is at odds with React, since components are dynamically
added and removed from the DOM.

To get this working, I first moved the markup that was in a template into a
functional component:

``` javascript
// app/frontend/components/Dropdown.jsx
import React from "react";

export default () => (
  <div>
    <button class="button" type="button" data-toggle="example-dropdown">Toggle Dropdown</button>
    <div class="dropdown-pane" id="example-dropdown" data-dropdown data-auto-focus="true">
      Example dropdown.
    </div>
  </div>
);
```

[CodeSandbox](https://codesandbox.io/s/quirky-volhard-puw9q)

The component renders, but the dropdown doesn't work! This is because the
component has been mounted to the page _after_ Foundation has initialised.

To resolve this, I used two React hooks
[`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) and
[`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect). `useRef`
is used to establish a reference to the DOM node, and `useEffect` is used to run
a function when the component has rendered.

Here's how the hooks are used in the working component:

``` javascript
// app/frontend/components/Dropdown.jsx
import React, { useRef, useEffect } from "react";
import jQuery from "jquery";
import "foundation-sites";

export default () => {
  const foundationRef = useRef(null);
  useEffect(() => jQuery(foundationRef.current).foundation(), [foundationRef]);

  return (
    <div ref={foundationRef}>
      <button class="button" type="button" data-toggle="example-dropdown">
        Toggle Dropdown
      </button>
      <div
        class="dropdown-pane"
        id="example-dropdown"
        data-dropdown
        data-auto-focus="true"
      >
        Example dropdown.
      </div>
    </div>
  );
};
```

[CodeSandbox](https://codesandbox.io/s/romantic-liskov-ggrv5)

The first argument to `useRef` is set to `null`, as there is no additional value
to use until the component is mounted. `useEffect` accepts the ref as a
dependency, as it only needs to render when the ref changes (e.g. when the
component is mounted), not every re-render.

---

Foundation JS is getting pretty dated these days - it's a heavy dependency, and
still relies on jQuery to work correctly. For projects already using the
framework though, it provides a useful mixture of styles and scripts, so it's
worthwhile being able to continue to leverage these javascript-backed behaviours
in React components.
