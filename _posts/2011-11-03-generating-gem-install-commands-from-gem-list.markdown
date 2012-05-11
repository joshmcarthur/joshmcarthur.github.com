---
layout: post
title: "Generating 'Gem Install' Commands From 'Gem List'"
date: 2011-11-03 16:34
comments: true
categories:
tags:
  - coding
  - ruby
  - scripts
  - hacks
---

Here at [3Months](http://3months.com), we have a couple of monolithic projects that have been around for yonks - because of this, they don't have bundler set up, and many of them have incomplete or out-of-date gem requirements. Yesterday I needed to get one of these projects set up locally for the first time, so I was kindly lent the output of `gem list` with which to install the gems at the correct versions required.

To make this problem a little easier in the future, I wrote a quick script to generate a massive shell command to install all the gems recorded in `gem list`. Next time I, or someone else, needs to set up one of these types of project, I can run this script, and hand them the generated shell script. They can run this in their gemset of choice, and install all gems required - much easier!

Here's the script - alternatively, you can check it out the [Gist](https://gist.github.com/1335721):

``` ruby
#!/usr/bin/env ruby


### gem_to_command.rb ###############################################################
# Produce a command to install the gems you currently have installed (using gem list)
# Makes a simple Shell script that can be run on Linux or Mac OS X
#
# Author: @sudojosh
######################################################################################

gems = `gem list`
File.open("install_gems.sh", "wb") do |script|
  script << "#!/usr/bin/env ruby\n"
  gems = gems.split("\n").map { |gem|
    gem = gem.split(' ').map { |part|
      part.gsub(/[^\w\.\-]/, '')
    };
    [gem[0], gem[1..-1].min]

  }
  gems.each { |gem|
    script << "gem install #{gem[0]} -v=#{gem[1]}"
    script << " && " unless gem[0] == gems.last[0]
  }
end
puts "Wrote install_gems.sh"
```

Here's what it does:

* Get the output of `gem list`
* Open a .sh file for writing
* Iterate through the `gem list` output, and parse from the file the name of the gem and the lowest version number (lowest is safer than highest, even though there *should* only ever be one)
* Assemble a `gem install` command with the `--no-rdoc --no-ri` arguments, and write this to the file.

Enjoy!
