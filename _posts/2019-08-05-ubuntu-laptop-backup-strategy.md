---
layout: post
title: "Ubuntu laptop backup strategy"
description: "How I backup my primary laptop."
category: TIL 
tags: [til,technology]
---

I recently upgraded my laptop from a 2013 Macbook Pro to a Lenovo Thinkpad T480. It's great. I
switched around my Ctrl key to the Windows key (where the Command key would be on a Mac keyboard),
and everything has pretty much been perfect.

One thing that I did need to rethink was my backup strategy, which, on my Macbook had been ad-hoc
TimeMachine. Coming from that, the world of backups on Linux was a little overwhelming. Many backup
tools are designed for, or at least documented for, continuously-running server environments, not a
laptop. Additionally, the backups will often be something like an automated rsync or scp, and not
have a particularly nice 'set and forget' experience. 

I did a bit of research, and found out that there probably wasn't a UI tool for my shopping list:

* **Diff backups:** I was coming from TimeMachine, so this was pretty important to me. I wanted a
  backup to just be a diff of the last backup, not a full copy every time. This cuts down on the
  time required for backing up, as well as upload size. 
* **S3 backup:** I don't run cloud servers myself - it's just another thing to keep locked down and
  secure. I already have some manual backups on S3, and I was keen to get my laptop backups headed
  there as well. S3 has a bunch of backup-relevant tools available, such as encryption-at-rest,
  versioning, access logging, and lifecycle rules. The lifecycle rules are particularly useful as
  this allows me to not have to manage much in the way of backup retention within the actual backup
  tool - I can just tell S3 to archive backups to Glacier after 6 months, and delete them a year
  after that (or whatever). Also, S3 storage at the scale of ~200GB is peanuts. Maybe a dollar.
* **GPG Encryption:** The same as S3. I use GPG for a few things, and like it. I like how it's tied
  to an identity, not a specific password. I suspect the 'right way' (if such a thing exists) is to
  generate a subkey tied to my main key and use this to encrypt my backups. I don't really
  understand subkeys, so I just made a whole new key for backups. This isn't perfect, but does mean
  that I can manage the key without worrying about what it's doing to my main key.
  
Not much to ask for, I thought, but it proved kind of hard to find what I was looking for. In the
end, I did find it though - and the joke was on me, since I had seen _duplicity_ mentioned many
times early in my research and had discarded it because "it didn't have a UI" :-(. 

_duplicity_ is a really nice backup tool. This is largely because it's not really a backup tool
itself, more of a tool that sticks a bunch of related tools together into a nice smooth pipeline. 

Without any extra installation, _duplicity_ could do all of the things on my shopping list. I even
got a neat bonus, where I could use the
[`multi://`](http://webcache.googleusercontent.com/search?q=cache:07-3ufYXKx4J:www.nongnu.org/duplicity//duplicity.1.html&hl=en&gl=nz&strip=1&vwsrc=0#sect18)
backend to backup to a local hard drive initially, and then to my primary S3 backup destination.
This setup allows me to have a local, space constrained, not-very-reliable backup that is _very fast
to restore from_ - while still retaining my primary, reliable, cost-effective and lots-of-retention
data store on S3. I was happy with this. It's not quite a 3-2-1 backup strategy - I have 2 copies of
my data, each on a different storage media, with 1 offsite. I could probably get 3 copies by
archiving to Glacier earlier, but my lifecycle rules are currently set up to initially keep backups
in S3 only.

So, _duplicity_ could do all the things I wanted it to, but all via command line flags. Not very
maintainable, I thought. A quick Google search, and I found that at least one other person thought
the same!

[_backupninja_](https://0xacab.org/riseuplabs/backupninja) is a wrapper for Duplicity (and a bunch of other backup tools, but I'm just using
Duplicity). It supports defining a backup 'pipeline' in `/etc/backup.d` to run a series of backups,
one after the other. It also supports scheduling backups and has a very usable curses-based
interface via the `ninjahelper` utility.

![The `ninjahelper` interface](/img/posts/ninjahelper.png)

I used the `ninjahelper` utility to create a Duplicity backup configuration file in
`/etc/backup.d/90.dup`, and then edited it extensively to achieve the backup behaviour I wanted. I
won't post the full configuration file here, but here are some excerpts relating to the points I
wanted to achieve above:

```
# Backup every day at 12pm. I am usually at work with an idle laptop around this time. 
when = everyday at 12
```

```
# These are extra options that I have experimented with:
#   --s3-use-multiprocessing will use S3 multipart uploads concurrently, one upload processs
#     per core. This speeds up the upload to S3.
#   --s3-use-server-side-encryption will tell S3 to encrypt the uploaded diff files using the S3
#     encryption key. I don't use my own KMS key because I mostly trust GPG.
#   --allow-source-mismatch had to be used initially because I had some partial backups. I probably
#     don't need it anymore.
#   --progress was supposed to tell me the progress of the upload when I manually run a backup. It
#     does do this, but the output isn't particularly useful.
#   --gpg-options needed to be specified, because backupninja runs as root to access all the things
#     it needs to backup. Without this, GPG was trying to use /root/.gnupg, and I didn't want to
#     have my keys spread across multiple users.
options = --s3-use-multiprocessing --s3-use-server-side-encryption --allow-source-mismatch
--progress --gpg-options "--homedir=~josh/.gnupg"
```

The GPG options are pretty simple. I just provided the encryption key and allowed this to be used
for both encryption and signing. I had hoped to keep the key password out of the config file, but didn't
have much luck loading it from elsewhere.

```
[gpg]

# when set to yes, encryptkey variable must be set below; if you want to use
# two different keys for encryption and signing, you must also set the signkey
# variable below.
# default is no, for backwards compatibility with backupninja <= 0.5.
sign = yes

# ID of the GnuPG public key used for data encryption.
# if not set, symmetric encryption is used, and data signing is not possible.
encryptkey = [public key]

# ID of the GnuPG private key used for data signing.
# if not set, encryptkey will be used.
signkey =

## password used to unlock the encryption key
## NB: neither quote this, nor should it contain any quotes,
## an example setting would be:
## password = a_very_complicated_passphrase
password = [key]

## password used to unlock the signature key, used only if
## it differs from the encryption key
## NB: neither quote this, nor should it contain any quotes,
## an example setting would be:
## signpassword = a_very_complicated_passphrase
signpassword =
```

The multi destination stuff is pretty neat. The actual config file just had a provider defined, when
the provider is actually just a path to a JSON file that defines the providers:

```
desturl = multi:///home/josh/.dotfiles/backup/providers.json
```

The JSON file contains details on how duplicity should connect to both backends. Once again, I tried
to keep secrets out of this file, but didn't have any luck providing them with any of the standard
ways of configuring AWS access key IDs and secrets:

```
[
	{
		"description": "Local backup. Not to be used for reliable backups, just for restore speed",
		"url": "file:///media/josh/DROPTANK/duplicity/flaps?mode=mirror&onabort=continue"
	},
	{
		"description": "Primary datastore",
    "url": "s3+http://[bucket name]/duplicity/flaps?mode=mirror&onabort=fail",
    "env": [
      { "name": "AWS_ACCESS_KEY_ID", "value": "[AWS access key ID]" },
      { "name": "AWS_SECRET_ACCESS_KEY", "value": "[AWS secret access key]" }
    ]
	}
]
```

The query params mentioned here do have special meaning as per the _duplicity_ man page:

* `mode` - mirror or stripe. I want to _mirror_ my backups - have a copy in each destination, not 
   striped across multiple destinations. 
* `onabort` - this is set to 'continue' for the disk backup, because if it fails, it's probably 
  because the disk just isn't plugged in (I'm probably not at my desk). For the S3 destination, 
  this is set to `abort`, because I want to know if _this_ backup fails. 

...and that's all the configuration. With this approach, I have automated daily diff backups to two
different sources - one local, one remote, with two different storage medium. Technically once my
lifecycle rules kick in, I'll actually have three sources and mediums since Glacier backups are
stored on a different media than normal S3 blobs (Bluray, I think). 
I use lifecycle rules on S3 to manage retention, which I  can basically configure to be indefinite 
if I want to, and the pricing is super reasonable, since the diff backups don't take up too much
transfer bandwidth or storage space once the initial backup is complete. Both my local and remote
backups are encrypted with a mechanism that I can manage myself - I'm not trusting Dropbox or Google
Drive or any other cloud storage provider to keep my files secure - but, since I can, I'm taking
advantage of S3 encryption anyway.

Hopefully this has been useful to somebody! I depended on a _lot_ of StackOverflow answers, blog
posts, man pages and other resources to put my configuration together - I certainly didn't just
figure it out - but I think that this backup strategy may work well for others as well. 

I have a couple of ideas for next steps. Fairly imminent is a restore test, which I'll probably aim
to conduct on an EC2 instance for the first restore just to make sure that everything goes smoothly.
If that goes well, I will snapshot my disk and try a restore onto my actual laptop.

I would also like to look into S3 region replication. This is something I normally have set up for
website uploads in my deveopment job, but I need to price it out for backups and make sure that it
won't blow things out too badly. If I get replication set up, then along with backups stored in S3
and Glacier, I'll also have an additional level of redundancy, with backups stored in a completely
different region (probably Ireland or Frankfurt since I don't like putting things is US regions and
don't quite trust London either anymore). Singapore is too close to my physical location to feel
safe and my primary backups are already in Sydney. 
