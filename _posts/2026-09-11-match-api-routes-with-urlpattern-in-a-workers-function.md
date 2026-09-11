---
title: Match API routes with URLPattern in a Workers function
category: TIL
---

I was wiring a handful of API routes on a Cloudflare Worker and didn't want a framework for it. I'd usually reach for a regex, or split the pathname and switch on segments.

I didn't know there was a web-standard way to do this, but there is! [URLPattern](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern) matches parts of a URL with a syntax that looks a lot like Express or Rails. It's in all major browsers now, and because it's a web standard API, it works in Workers.

> Named groups capture a path segment (`:subdomain`). A `+` modifier repeats the group one or more times, so `:path+` matches `/foo` and `/foo/bar/baz`.

Compile the patterns once when the module loads, then iterate over the list to find a match:

```ts
const routes: Route[] = [
  { method: "GET", pathname: "/api/health", handle: getHealth, requireSecret: false },
  { method: "POST", pathname: "/api/v1/availability", handle: postAvailability },
  { method: "GET", pathname: "/api/v1/sites/me", handle: getSitesMe },
  { method: "POST", pathname: "/api/v1/sites/claim", handle: postSitesClaim },
  { method: "PATCH", pathname: "/api/v1/sites/:subdomain/forwarding", handle: patchSiteForwarding },
  { method: "POST", pathname: "/api/v1/sites/:subdomain/links", handle: postSiteLink },
  { method: "DELETE", pathname: "/api/v1/sites/:subdomain/links/:path+", handle: deleteSiteLink },
  { method: "POST", pathname: "/api/v1/sites/:subdomain/aliases", handle: postSiteAlias }
];

const compiled = routes.map((route) => ({
  ...route,
  pattern: new URLPattern({ pathname: route.pathname }),
}));

export async function routeRequest(request: Request): Promise<Response> {
  for (const route of compiled) {
    if (request.method !== route.method) continue;
    if (!route.pattern.exec(request.url)) continue;
    return route.handle(request);
  }
  return jsonNotFound();
}
```

`exec` returns a match object or `null`. If you need the captured bits, they're on `pathname.groups`. We check the HTTP method first so we skip the pattern when the verb is wrong.

That's the whole router. Fine for a short list of routes, and there are always libraries like itty-router if you need more.
