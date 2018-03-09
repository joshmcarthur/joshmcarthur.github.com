---
layout: post
title: "Calibre Content Server"
description: ""
category: TIL
tags: [til,tech]
---

I've used [Calibre](https://calibre-ebook.com/) for years to manage my eBook collection. It's a great piece of software that has
always worked really well for me. 

I discovered today that Calibre has the ability to start a "content server". This provides an endpoint which serves information about the Calibre library, including
covers, titles, and descriptions. The content server can be started by clicking "Connect/Share" in the top menu bar, and then selecting "Start Content server". This starts a server listening on all hosts on port 8080.

![Option to start content server](/img/posts/calibre-content-server.png)

Under "Preferences" -> "Sharing over the net", there are a slew of options allowing for some customization of how the content server works, including authentication mechanisms.

Visiting http://localhost:8080 will allow a library to be selected and will show a nice grid view of all the books in the library, along with cover images, titles/descriptions, and options to download books in all the formats which have been generated for that particular title.

I'm making use of this feature of Calibre to begin moving my library off my own laptop onto the Raspberry Pi which manages much of my home network infrastructure. In particular, the content server will allow me to create a shared library with the rest of my household.
