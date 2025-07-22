---
title: A Stimulus controller to auto-submit authentication codes
category: TIL
---

I think this is neat - very succinct. This controller expects an input that
calls `formatOnSubmit` on input, which removes invalid chracters, strips the
input (e.g. of spaces), and then automatically submits it. Works great with
pasting, manually typing, and provides fast feedback to users.

```javascript
import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["input"];

  formatAndSubmit(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ""); // Remove non-digits

    // Limit to 6 digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    input.value = value;

    // Auto-submit when 6 digits are entered
    if (value.length === 6) {
      input.form.requestSubmit();
    }
  }
}
```

I use this controller for things like email and 2FA codes, bound with a simple
bit of markup:

```html
<form data-controller="verification-code">
  <input
    type="text"
    pattern="[0-9]{6}"
    maxlength="6"
    autofocus
    required
    data-verification-code-target="input"
    data-action="input->verification-code#formatAndSubmit"
  />
  <button type="submit">Verify Code</button>
</form>
```
