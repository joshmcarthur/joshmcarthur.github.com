---
layout: post
title: "Safely Start and Stop VirtualBox VMs with init.d"
date: 2011-10-19 17:05
comments: true
tags:
  - howto
  - linux
  - sysadmin
  - virtualbox
---

Recently I've rolled out a virtual machine host box to run headless VMs (headless means that there is no display, keyboard etc plugged into it), as these make great test and experiment machines for trying new things out. As part of this rollout, I mashed a couple of blogs and some documentation together and came up with this script:

``` bash
#!/bin/sh

# virtual_machines	Start and stop virtual machines when the host changes state
#
#
VMUSER=administrator

case "$1" in
	start)
		echo "Starting VirtualBox VMs"
		if [ -f /etc/virtualbox/machines_enabled ]; then
			cat /etc/virtualbox/machines_enabled | while read VM; do
			  sudo -H -b -u $VMUSER /usr/bin/VBoxHeadless -startvm "$VM"
			done
		fi
		;;
	stop)
		echo "Saving state of VirtualBox VM..."
		cat /etc/virtualbox/machines_enabled | while read VM; do
		  sudo -H -u $VMUSER /usr/bin/VBoxManage controlvm "$VM" savestate
		done
		;;
	*)
		echo "Usage: /etc/init.d/virtual_machines {start|stop}"
		exit 1
		;;
esac

exit 0

```


I wrote this because this isn't something that is supported directly by VirtualBox, and it's essential that on a headless server that these virtual machines be able to go up and down happily without harm and reliably. It supports start and stop explanations and uses savestate, rather than poweroff - essentially, as the host server goes down, it will 'hibernate' each VM, and then restore when the server starts back up again.

Another feature that I built into this was the use of a file in which a list of VMs can be specified to start and stop - for example, if you only want this script to deal with a subset of the virtual machines you have set up on the host server.

An example of this file might look like this:

```
winxp_development
win7_development
ubuntu_11_10_development
```


It works really well for me, and since it's something I had trouble tracking down, hopefully I can make someone's life a little easier with this solution.



