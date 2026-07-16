---
title: When VPN DNS works in dig but not in curl on macOS
category: TIL
---

I occasionally use [openfortivpn](https://github.com/adrienverge/openfortivpn) on macOS. The VPN comes up fine, but internal hostnames still fail in apps. `curl` can't resolve them. Browsers can't either.

Meanwhile `dig internal.example.com` returns the right answer. openfortivpn has added VPN nameservers to `/etc/resolv.conf`, but on macOS that file isn't what `curl`, browsers, or `ping` use. `dig` still reads it, which is why lookups can work in the terminal but fail in apps.

On Linux, openfortivpn updates DNS via `/etc/resolv.conf` (or `resolvconf` if configured). On macOS it stops at `/etc/resolv.conf` and never touches per-interface DNS. You have to set that yourself.

## macOS DNS is per network service

macOS doesn't have one global DNS config. Each network service (Wi-Fi, Ethernet, and so on) has its own DNS servers. The system resolver uses settings from whichever interface is carrying your traffic.

openfortivpn creates a `ppp` tunnel but doesn't call `networksetup` to push the VPN's DNS servers onto your active network service. So apps keep using whatever DNS was already configured on that interface.

## Diagnose what's actually in use

List hardware ports and their device names:

```sh
networksetup -listallhardwareports
```

List network services (the names you pass to `networksetup`):

```sh
networksetup -listallnetworkservices
```

Dump the resolver config macOS is using, including per-interface DNS:

```sh
scutil --dns
```

`scutil --dns` shows interface devices like `en0`, not service names like `"Wi-Fi"`. Use `networksetup -listallhardwareports` to map between them. If your VPN DNS servers aren't listed there for the interface you're actually on, that's the gap.

## Set DNS on the right service

Once you know the service name, set DNS servers on that specific service:

```sh
networksetup -setdnsservers "Wi-Fi" 10.0.0.53 10.0.0.54
```

Swap `"Wi-Fi"` for whatever `networksetup -listallnetworkservices` shows for your active connection. Use whatever servers your VPN or IT docs specify. To clear custom DNS and go back to DHCP:

```sh
networksetup -setdnsservers "Wi-Fi" Empty
```

`networksetup` changes stick on that service until you clear them. I set mine when VPN DNS isn't showing up in `scutil --dns`, not on every connect. I don't always need to use the VPN resolver (e.g. if I'm connecting directly by IP).

## Flush the resolver cache

After changing DNS, flush macOS's cache so apps pick up the new config:

```sh
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

You shouldn't need a reboot. If something still looks stale, disconnect and reconnect the VPN.

## Why dig works without setting DNS per interface

Plain `dig` reads nameservers from `/etc/resolv.conf`. That's the file openfortivpn updates, so `dig internal.example.com` can succeed even when apps fail.

`dig @10.0.0.53 internal.example.com` goes further and queries a specific server directly, bypassing macOS's system resolver entirely.

`curl`, browsers, and most other apps use the system resolver (`getaddrinfo` and friends). They only see DNS servers configured on the active network service.

So `dig internal.example.com` can work while `curl https://internal.example.com` fails with "Could not resolve host". The VPN DNS is reachable. macOS just isn't using it for application lookups until you set it on the right interface.
