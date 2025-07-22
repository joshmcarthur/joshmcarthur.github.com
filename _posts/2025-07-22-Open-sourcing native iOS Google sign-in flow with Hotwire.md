---
title: Open-sourcing a reference implementation of native iOS Google sign-in flow with Hotwire
---

I've just open sourced a reference implementation of native iOS Google sign-in
using [Hotwire Native](https://native.hotwired.dev/). I developed this flow when
building [Virtualtrails](https://virtualtrails.app), where I wanted to support
both web and native authentication flows for Google Sign-in. Using Hotwire for
this worked great - when native support is available, it's automatically used.
When not, it falls back to a web-based OAuth flow.

https://github.com/joshmcarthur/hotwire-native-google-sign-in