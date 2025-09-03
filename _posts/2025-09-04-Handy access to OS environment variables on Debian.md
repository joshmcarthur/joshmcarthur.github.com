---
title: Handy access to OS environment variables on Debian
category: TIL
---

This morning, while checking (yet again) how to [install Postgres inside a Debian container](https://www.postgresql.org/download/linux/debian/), I stumbled across a file that I didn't know existed - `/etc/os-release` - this file contains a bunch of handy variables which can be sourced to chuck them into your environment as environment variables:

```sh
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
VERSION="12 (bookworm)"
VERSION_CODENAME=bookworm
ID=debian
HOME_URL="https://www.debian.org/"
SUPPORT_URL="https://www.debian.org/support"
BUG_REPORT_URL="https://bugs.debian.org/"
```

`$VERSION_CODENAME` is particularly handy for building apt repo release strings, but there's a lot useful stuff in there!