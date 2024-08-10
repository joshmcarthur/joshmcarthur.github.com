---
title: Tapping targets with Stimulus
---

Normally I would use Bootstrap's [stretched
link](https://getbootstrap.com/docs/5.3/helpers/stretched-link) behaviour to
implement functionality where clicking anywhere on a containing element triggers
a link element. This is useful for cards, menus, and other cases where a
'primary' link can benefit from a larger tap target.

Bootstrap's stretched link works by adding an `::after` pseudo element to the
link element with the `stretched-link` class, then using absolute positioning to
position the pseudoelement across the container. The 'container' requires some
definition since it depends on the normal requirements for an
absolute-positioned container - Bootstrap's [docs on identifying the containing
block](https://getbootstrap.com/docs/5.3/helpers/stretched-link) are useful
here.

In my case, I couldn't quite get this to work. I was implementing a card with a
dropdown menu of actions, of which one action was the primary one. I wanted to
support functionality to allow users to tap anywhere on the card to trigger the
primary action, unless the dropdown menu was triggered.

To resolve this, I created what I thought would be a small Stimulus controller
to listen for click events on a containing element, and trigger a click on the
element:


```typescript
import { Controller } from '@hotwired/stimulus';

export default class TappableTargetController extends Controller {
  public static readonly targets = ['receiver'];
  private readonly receiverTarget!: HTMLElement;

  public connect(): void {
    this.element.classList.add('cursor-pointer');
    this.element.addEventListener('click', (evt) => {
      this.receiverTarget.click();
    });
  }
}
```

This seemed to work great! The element had the correct cursor style, and when
clicked, triggered the primary action. Then I tried to open the dropdown menu to
check other actions - oops - this click was also captured, so the dropdown menu
was no longer expandable!

I used Claude 3.5 to create a more complicated version to handle this case:

```typescript
import { Controller } from '@hotwired/stimulus';

export default class TappableTargetController extends Controller {
  public static readonly targets = ['receiver'];
  private readonly receiverTarget!: HTMLElement;

  public connect(): void {
    this.element.classList.add('cursor-pointer');
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the clicked element is the controller element itself
    if (target === this.element) {
      this.receiverTarget.click();
    } else {
      // Check if the clicked element is a button or anchor tag
      const isInteractableElement = target.matches('button, a, [role="button"]');

      // If it's not an interactable element, trigger the receiver's click
      if (!isInteractableElement) {
        this.receiverTarget.click();
      }
      // If it is an interactable element, let the default behavior occur
    }
  }
}
```

This nearly works, but in my case, the dropdown menu displays an overflow icon
using an SVG. The variant above seemed that it would work, but the event is
triggered on the SVG, not the button, so is not counted as a click on an
interactable element. I knew what I'd need to do - I'd need to consider the
target's ancestors - but again, one of those fiddly things that I reached for
Claude for the next iteration:

```typescript
import { Controller } from '@hotwired/stimulus';

export default class TappableTargetController extends Controller {
  public static readonly targets = ['receiver'];
  private readonly receiverTarget!: HTMLElement;

  public connect(): void {
    this.element.classList.add('cursor-pointer');
    this.element.addEventListener(
      'click',
      this._handleClick.bind(this) as EventListenerOrEventListenerObject
    );
  }

  private _handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the clicked element or any of its ancestors up to the controller element is interactable
    if (this._isOrHasInteractableAncestor(target)) {
      // Let the default behavior occur for interactable elements
      return;
    }

    // If we've reached here, it means the click was not on an interactable element
    this.receiverTarget.click();
  }

  private _isOrHasInteractableAncestor(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;

    while (currentElement && currentElement !== this.element) {
      if (this._isInteractableElement(currentElement)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }

    return false;
  }

  private _isInteractableElement(element: HTMLElement): boolean {
    return element.matches('button, a, [role="button"], [tabindex="0"]');
  }
}
```

This version works, but doesn't handle an important user experience
consideration - it should be possible to use a standard keyboard shortcut to
open the link in a new tab. This is usually done by holding the Command
(Control) key down while clicking the link. The final controller iteration
handles this case:

```typescript
import { Controller } from '@hotwired/stimulus';

export default class TappableTargetController extends Controller {
  public static targets = ['receiver'];
  private readonly receiverTarget!: HTMLElement;

  public connect(): void {
    this.element.classList.add('cursor-pointer');
    this.element.addEventListener(
      'click',
      this._handleClick.bind(this) as EventListenerOrEventListenerObject
    );
  }

  private _handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the clicked element or any of its ancestors up to the controller element is interactable
    if (this._isOrHasInteractableAncestor(target)) {
      // Let the default behavior occur for interactable elements
      return;
    }

    // Prevent the default action
    event.preventDefault();

    // If Ctrl key (or Cmd key on Mac) is pressed, open in new tab
    if (event.ctrlKey || event.metaKey) {
      this.openInNewTab();
    } else {
      // Otherwise, perform the regular click action
      this.receiverTarget.click();
    }
  }

  private _isOrHasInteractableAncestor(element: HTMLElement): boolean {
    let currentElement: HTMLElement | null = element;

    while (currentElement && currentElement !== this.element) {
      if (this._isInteractableElement(currentElement)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }

    return false;
  }

  private _isInteractableElement(element: HTMLElement): boolean {
    return element.matches('button, a, [role="button"], [tabindex="0"]');
  }

  private _openInNewTab(): void {
    // Assuming receiverTarget is an anchor element
    if (this.receiverTarget instanceof HTMLAnchorElement) {
      window.open(this.receiverTarget.href, '_blank');
    } else {
      // If it's not an anchor element, log a warning
      console.warn(
        'Receiver target is not an anchor element. Cannot open in new tab.'
      );
    }
  }
}
```

This version worked great - I could hold down Command to open links in a new
tab, and it worked exactly like a native link.

That's exactly what got me
thinking though - while I had emulated one user experience enhancement, there
were tonnes of others that users might be relying on, and it's not really
practical for me to emulate every one of these enhancements.

Ultimately, I decided not to use this code for this exact reason - I have too
many concerns about not supporting behaviour that users will expect to 'just
work', and might even harm the accessibility of links that I know will be
important to users.

Instead, I reverted to using the `stretched-link` class, but changed it to be on
my dropdown menu toggle, instead of the primary action. I then gave the primary
action a bit more prominence in the dropdown menu. This introduces an extra
click to trigger the action, but also retains the accessibility and usability of
how this link can be accessed and interacted with - and that's important to me.

I still have an option to experiment with transparent (but still visible to
screen reader) links, so I have a fallback to support a primary action, but for
now, I'm ready to test triggering the dropdown, and will iterate on this if
required.