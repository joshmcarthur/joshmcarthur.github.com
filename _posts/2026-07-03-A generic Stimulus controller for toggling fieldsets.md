---
title: A generic Stimulus controller for toggling fieldsets
category: TIL
---

I was building an achievement editor in [Virtualtrails](https://virtualtrails.app)
where route creators can place a milestone either as a distance along the route,
or as a latitude/longitude pair that gets converted server-side. The form needs
to offer both options, but only one should be active at a time — and only the
active panel's fields should be submitted.

My first iteration was a purpose-built controller with targets like
`distancePanel`, `coordinatesPanel`, `latitudeInput`, and so on. That works, but
it is not reusable. The next form that needs different sections would
get its own copy.

Instead, I prefer a generic controller that toggles panels based on which radio
button is selected.

## The controller

```typescript
import { Controller } from '@hotwired/stimulus';

export default class FieldsetToggleController extends Controller {
  public static readonly targets = ['panel', 'radio'];

  public readonly panelTargets!: HTMLElement[];
  public readonly radioTargets!: HTMLInputElement[];

  public connect(): void {
    this.toggle();
  }

  public toggle(): void {
    const selectedValue = this._selectedValue;

    this.panelTargets.forEach(panel => {
      const active = panel.dataset.fieldsetToggleValue === selectedValue;

      panel.classList.toggle('d-none', !active);
      panel
        .querySelectorAll<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >('input, select, textarea')
        .forEach(input => {
          input.disabled = !active;
        });
    });
  }

  private get _selectedValue(): string {
    const checkedRadio = this.radioTargets.find(radio => radio.checked);
    const [fallbackRadio] = this.radioTargets;

    return (checkedRadio ?? fallbackRadio).value;
  }
}
```

On connect, and whenever a radio changes, the controller:

1. Finds the checked radio's `value`
2. Shows the panel whose `data-fieldset-toggle-value` matches
3. Hides the rest
4. Disables inputs inside hidden panels so they are not submitted with the form

That last step matters. Hiding fields with CSS is not enough — browsers will
still submit them unless they are disabled.

For the selected value, I use the checked radio if there is one, otherwise the
first radio in the group. Stimulus guarantees at least one `radio` target is
present when the controller connects, so there is no need for a chain of
optional chaining and nullish coalescing on `.value` — that property is always a
`string` on `HTMLInputElement`, and `@typescript-eslint/no-unnecessary-condition`
will rightly complain if you pretend otherwise.

## The markup

Each toggle group is self-contained. Radio buttons and panels are matched by
value:

```erb
<fieldset data-controller="fieldset-toggle">
  <legend>Distance begin</legend>

  <div class="btn-group btn-group-sm mb-3" role="group">
    <input type="radio"
           class="btn-check"
           name="distance_begin_input_mode"
           id="distance_begin_mode_distance"
           value="distance"
           checked
           data-fieldset-toggle-target="radio"
           data-action="fieldset-toggle#toggle">
    <label class="btn btn-outline-secondary" for="distance_begin_mode_distance">
      Distance
    </label>

    <input type="radio"
           class="btn-check"
           name="distance_begin_input_mode"
           id="distance_begin_mode_coordinates"
           value="coordinates"
           data-fieldset-toggle-target="radio"
           data-action="fieldset-toggle#toggle">
    <label class="btn btn-outline-secondary" for="distance_begin_mode_coordinates">
      Coordinates
    </label>
  </div>

  <div data-fieldset-toggle-target="panel" data-fieldset-toggle-value="distance">
    <input type="number" name="achievement[distance_begin]" step="any" class="form-control">
  </div>

  <div class="d-none" data-fieldset-toggle-target="panel" data-fieldset-toggle-value="coordinates">
    <input type="text" name="achievement[distance_begin_latitude]" class="form-control mb-2" placeholder="Latitude">
    <input type="text" name="achievement[distance_begin_longitude]" class="form-control" placeholder="Longitude">
  </div>
</fieldset>
```

Note that the `name` on the radio group is outside the `achievement[...]`
namespace. It is only there to keep the buttons exclusive in the UI - it
does not need to reach the server.

You can nest several of these on one page — for example, separate toggles for
distance begin and distance end — because each `fieldset-toggle` controller
scope is limited to its own element.

## When to reach for this

This pattern fits whenever a form offers alternative ways to supply the same
kind of data: distance vs coordinates, search by name vs by ID, delivery vs
pickup address, and so on.

It stays deliberately small. No opinions about panel structure, validation, or
how values are labelled — just radios, panels, show/hide, and enable/disable.

That is usually enough.
