---
title: Aotearoa, Again
layout: case_study
url: https://aotearoa-again.joshmcarthur.com/
featured_image:
  - /img/case-studies/aotearoa-again-edition.png
  - /img/case-studies/aotearoa-again-compare.png
  - /img/case-studies/aotearoa-again-admin.png
summary: |
  Daily AI-colourised photographs from the Alexander Turnbull Library.
  A personal publishing machine on boring Rails tech, kept cheap and
  low-maintenance on purpose.
---

I've always liked historical photography, especially when it shows places I know
in a different light: a rural stretch before the motorway went through, or the
harbour bridge half-built. I created [Aotearoa,deliberately Again](https://aotearoa-again.joshmcarthur.com/) to share that interest with others.

Every morning (New Zealand time) the site publishes one photograph from the
[Alexander Turnbull Library](https://natlib.govt.nz/collections/a-to-z/alexander-turnbull-library),
harvested via [DigitalNZ](https://digitalnz.org/). Plates are fetched and
AI-colourised ahead of time. I review and schedule them into a runway of upcoming editions (same idea as Buffer), so publish morning is automatic. From
there each edition goes out to the web, an Atom feed, a Buttondown newsletter, and social channels. The originals stay in the archive. The site is another way
into that history, not a replacement for it.

Colours are interpretive, not documentary. The
[about page](https://aotearoa-again.joshmcarthur.com/about) is honest about that,
and every edition links back to the library record with rights and attribution.
I care about respecting the original creators and the library's terms of use.

[**Live site**](https://aotearoa-again.joshmcarthur.com/) ·
[**Subscribe**](https://buttondown.com/aotearoa-again) ·
[Instagram](https://www.instagram.com/aotearoa.again) ·
[Facebook](https://www.facebook.com/aotearoa.again) ·
[YouTube](https://www.youtube.com/@aotearoa-again) ·
[Bluesky](https://bsky.app/profile/aotearoa-again.joshmcarthur.com)

## The daily edition

The public page stays quiet on purpose: just the title, caption, plate details,
rights, and a compare slider. I wanted people to be able to drag between the
greyscale original and the colourised plate, not only see the colourised
version. Sliding back and forth is a good way to sit with the history of the
image and notice what the colourisation changes.

<img src="/img/case-studies/aotearoa-again-edition.png" alt="Today's Aotearoa, Again edition: Mangaweka, Rangitikei District, with the compare slider" />

<img src="/img/case-studies/aotearoa-again-compare.png" alt="Compare slider on an older edition, Maori Pioneers on the Somme, mid-drag between colour and original" />

## How it runs

What I wanted was a publishing machine that didn't feel like a research demo.
I picked a stack that is boring on purpose: Rails 8, SQLite, Solid
Queue/Cache/Cable, Active Storage on disk, libvips for stills, ffmpeg for
vertical share video. It runs at home behind a Cloudflare Tunnel.

Every candidate plate is sourced from DigitalNZ with rights that permit reuse
(including commercial use when social uploads need it). I generate variants with
preferred RubyLLM/OpenRouter models, but nothing gets scheduled until I've
reviewed and approved it for the runway. One plate a day keeps colourisation cost
and post volume reasonable.

When an edition publishes, channel jobs fire for Buttondown email, Instagram
(feed + reel), Facebook Page, YouTube Shorts, and Bluesky. Bluesky posts include
[Standard.site](https://standard.site/) document and publication records so the
link card gets publication branding instead of a bare domain preview. Other
social networks use Open Graph tags as usual.

Branded stills and 9:16 video are composed once, then reused across Meta,
YouTube, OG tags, and the Atom enclosure. That keeps captions and image URLs
stable for clients that won't follow signed blob URLs.

Admin is small on purpose, not a full CMS: HTTP Basic, candidates, preferred
models, and the editions schedule. The point is to queue editions and resubmit
images until I've got a result I'm happy to ship.

<img src="/img/case-studies/aotearoa-again-admin.png" alt="Admin editions runway listing scheduled and published plates" />

I wanted something I'd still be happy running in a year: something I'd be an
enthusiastic user of, honest about what AI gets wrong, and cheap enough that
keeping it online isn't a project in its own right.

If this project interests you, or you have feedback, get in touch. I'd love to
hear from you.
