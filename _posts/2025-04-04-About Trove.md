---
title: About Trove Project
---

I’ve been working this week on Trove
([Github](http://github.com/joshmcarthur/trove-project/),
[Docs](https://joshmcarthur.com/trove-project)). Trove is meant to be a
self-hosted system that can store arbitrary (but schema validated) JSON data,
files, and relationships between events. By events I mean things like:

- Bookmarks
- Photos I like
- Colours/patterns I’ve seen out and about that I like
- Storypark updates (from daycare/school)
- etc.

Basically all the digital miscellanery that I want to hang on to, but currently
exists as a google keep note, or read email that I don’t ever archive. I don't
plan on trying to replicate services I already use like Google Photos, Google
Drive, iCloud, and the like, but rather might cherry-pick particular bits of
content from those systems to hang onto separately.

I’ve just completed the core, which is basically an event bus with a plugin
system. Plugins (will be able to) register new schemas (event types), web/API
endpoints, or the ability to process specific event types. Processing like:

- Screenshotting a bookmarked website/extracting a MHTML archive
- Label/OCR/face detection on images
- Thumbnailing images
- Generating colour palettes from a saved color
- Extracting and saving attachments from an email
- Extracting a note from an email
- Visiting a link from an email and scraping the resulting page

This particular project is massively ambitious, but it’s also a good exercise in
trying to stay really focussed on a small core and try and architect it so that
I can achieve all of the above, and any other ideas I have, just using the
plugin system. I’m taking a lot of inspiration from HomeAssistant in being very
modular and trying to be very adaptable. I’m using Deno, which is an alternative
JS/TS runtime to Node, and I’m feeling really good about that. I’m doing my best
to not have any dependencies outside the Deno standard library, and automating
builds and releases. I want self-hosted data I put in to be safe and private to
me, but it’s also a fun and challenging constraint to think about designing
Trove to be able to be useful 10 years from now without a tonne of maintenance
intervention.

I don’t have a stable release yet, but I will soon. Right now, the core works as
a library, but I’ll be setting it up as a precompiled CLI program and setting up
Github releases to distribute Mac OS/Windows/Linux binaries and Docker images.
The CLI program will accept a typescript configuration file which determines
what plugins to load, what configuration to pass to those plugins, and how to
store events, files, and event links (which can be a single storage, or an
individual storage for each).

I also have plans to create an API (JSON and JSON-over websocket), and a web and
native frontend. I'll be utilising plugins for each of these, and don't expect
to need to extend the core. This means that if myself, or someone else does not
want or need a web frontend, or a native frontend, or an API, that plugin can
just be omitted from the configuration. I'm also expecting API and web core
plugins to allow other plugins to build on them, allowing for authentication,
middleware, and routing within plugins to create new capabilities without having
to extend the core.