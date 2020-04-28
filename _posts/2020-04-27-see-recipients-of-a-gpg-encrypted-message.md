---
layout: post
title: "See recipients of a GPG encrypted message"
description: ""
category: 
tags: [til,technology]
---

```
gpg --list-only $infile
```

e.g.

```
gpg --list-only test.txt.gpg
```

This command outputs recipient info, including recipient key ID and details if known:

With an empty keyring (no public keys imported):

``` 
gpg: encrypted with RSA key, ID 70F28839
```

With a populated keyring (public key of recipient imported):

```
gpg: encrypted with 4096-bit RSA key, ID 70F28839, created 2018-05-29
      "Josh McArthur <jo....@gmail.com>"
```
