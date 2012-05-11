---
title: "Ubuntu: Quick ImageMagick Install"
layout: post

type: regular
comments: true
---

[This is cross-posted from a tweet I posted a while back - I think it's a nice
bit of advice, and I wanted to store it in a more persistent form]
Installing ImageMagick is one of the things that Rails developers need to do
reasonably often when provisioning new servers - basically, if you're doing any
sort of image processing in your application (including the popularPaperclip
gem), ImageMagick is what you'll be using.
The problem is that there is a bit of a magical formula I have needed to use in
the past - if you just install ImageMagick, it will most likely not work, as it
needs to have support for different image formats you want to use compiled it
in right from the get go. Previously, I have just looked up the various
libraries I have needed (For PNG, JPEG, etc.), and then either found the
libraries in the Ubuntu package repositories or built them from source.Â 
A nice quick way of doing it though, is to use an ImageMagick meta-package in
the Ubuntu repositories named libmagick-9-dev - it is just a collection of
popular image format libraries, as well as a couple of additional utilities for
ImageMagick. You can install it on any Ubuntu system by running this command:
sudo apt-get install libmagick-9-dev
ImageMagick itself still needs to be installed, of course. The best option here
is just to build from source - packages in the repositories are horribly out of
date, and I have found Paperclip, RMagick and Minimagick all require a fairly
recent version of ImageMagick.
Building from source sounds really intimidating, but it really isn't - just
follow these steps:
First of all, download a tarball of the ImageMagick source onto your computer:
wget ftp://ftp.imagemagick.org/pub/ImageMagick/ImageMagick.tar.gz
Next, extract the tarball:
tar -xvzf ImageMagick.tar.gz
Now configure the package - note especially the end of the output (There is a
lot of output) - it tells you which Image libraries you have installed - any
with 'yes' next to them it will happily format and convert - because you've
installed the package above, all the common formats should have a 'yes' next to
them, but it's worth checking.
cd ImageMagick-[VERSION] (VERSION will be a series of numbers like '6.7.0-8')
./configure
Now all the hard work (By you) is done - you just need to compile the packages:
make &amp;&amp; sudo make install
All done! - ImageMagick should be all installed. To check, run the command
which identify, and check it returns a path to the 'identify' command.
Note: If you have trouble compiling, make sure Ubunutu's build tools are
installed: sudo apt-get install build-essential

