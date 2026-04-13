---
title: How to handle Cloudflare Challenge pages when making Turbo requests
category: TIL
---

[Turbo Drive](https://turbo.hotwired.dev/handbook/drive) intercepts link clicks and form submissions, fetching the next page with `fetch()` and swapping the `<body>` in place rather than doing a full browser reload. That's great for smoothness, but it means the browser never performs a real navigation — and some things depend on a real navigation to work.

[Cloudflare challenge pages](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/) are one of those things. When Cloudflare decides a request needs to be challenged, it returns a special HTML page that runs JavaScript to verify the visitor. If Turbo swaps that HTML into the existing `<body>` the challenge scripts fail to initialise and the user ends up stuck on a broken page.

Cloudflare [marks challenge responses](https://developers.cloudflare.com/cloudflare-challenges/challenge-types/challenge-pages/detect-response/) with a `Cf-Mitigated: challenge` header. Turbo fires a `turbo:before-fetch-response` event after a fetch completes but before it processes the body, which is the right place to catch this. Calling `event.preventDefault()` stops the swap, then `window.location.assign()` upgrades the visit to a real navigation:

```typescript
document.addEventListener('turbo:before-fetch-response', (event: Event) => {
  if (
    !('detail' in event) ||
    !event.detail ||
    typeof event.detail !== 'object'
  ) {
    return;
  }

  const { fetchResponse } = event.detail as {
    fetchResponse: { header: (name: string) => string | null; location: URL };
  };

  if (fetchResponse.header('cf-mitigated') !== 'challenge') {
    return;
  }

  event.preventDefault();
  window.location.assign(fetchResponse.location.href);
});
```

The `detail` guard is there because TypeScript types the event as a plain `Event` — Turbo's custom properties aren't in the standard lib, so a cast is needed. The early return keeps the handler cheap for the overwhelming majority of requests that aren't challenges.

Once the challenge is solved, Cloudflare redirects back to the original URL, which Turbo handles as a normal navigation.