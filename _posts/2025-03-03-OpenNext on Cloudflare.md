---
title: OpenNext on Cloudflare
category: TIL
---

I’m trying out OpenNext with Cloudflare. One kind of annoying thing already I’ve run into is that libraries that use cross-fetch end up running into errors, because OpenNext patches the deployment package enough that cross-fetch tries to use Node libraries, when actually it can just use native fetch.

In the case I ran into, I could work around this by performing a native fetch, then processing the response. Alternatively, I can use patch-package to resolve cross-fetch's fetch to the built-in version.


