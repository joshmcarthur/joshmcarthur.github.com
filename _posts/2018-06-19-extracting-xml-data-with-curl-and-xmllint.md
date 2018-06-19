---
layout: post
title: "Extracting XML data with curl and xmllint"
description: "A simple one-liner for extracting XML content using preinstalled command-line utilities"
category: TIL
tags: [til,technology]
---

(I start off talking about _why_ I was doing this. You can [jump to the tip](#tip) if you want.)

I use [HomeAssistant](https://www.home-assistant.io/) heavily at home for converging a range
of smart home data from sensors around my house, as well as from a range of open data sources.

HomeAssistant has a REST sensor which is good for a known data source with a friendly format, but, because of the architecture of HomeAssistant, this sensor is not particularly flexible to use when the data is coming from a third-party in a format that isn't readily usable. For more complex data consumption, a command line sensor may be appropriate. A command line sensor captures the output of running a command as the sensor value. The trick with this is to use `curl` and some kind of data parsing routing to extract the data you actually want as your sensor value. That's what I'm going over.

<div id="tip"></div>

I used two utilities for this - `curl`, and `xmllint`. `curl` is preinstalled a lot these days, but if you don't have it, it's a simple `brew install curl`/`apt-get install curl`, etc. away. `xmllint` is a little harder. It's technically either part of, or strongly related to `libxml2` (it seems to be a reference or demo of how to use libxml2?). I have it on Mac OS by having `libxml2` installed using Homebrew, but on Ubuntu Server I had to `apt-get install libxml2-utils`. YMMV, but I suspect that `-utils` package is required in most Linux distributions. Once you _do_ have it though, you can take advantage of Unix pipes to pluck out the XML you need using XPath.

Here's an example that I'll break down:

```sh
curl "http://api.opendata.tld/example.xml" |\
  xmllint --xpath "//Measurements/Data/Reading[last()]/Value/text()" -
```

First of all, `curl "http://api.opendata.tld/example.xml"`. This requests the given URI, streaming the response to the pipe. For the sake of the further examples, let's assume it returns XML data in the following format:

```xml
<Measurements>
  <Author>Data Publisher</Author>
  <Data DateFormat="Calendar" NumItems="1">
    <Reading>
      <Time>2018-06-19T08:45:00</Time>
      <Value>11.8</Value>
    </Reading>
    <Reading>
      <Time>2018-06-19T09:00:00</Time>
      <Value>11.8</Value>
    </Reading>
    <Reading>
      <Time>2018-06-19T09:15:00</Time>
      <Value>11.8</Value>
    </Reading>
  </Data>
</Measurements>
```

The second part of this command is the pipe to `xmllint`. `xmllint` is passed two key arguments. The first, `--xpath`, contains an [XPath expression](https://developer.mozilla.org/en-US/docs/Web/XPath) for waht to select, and the trailing dash (`-`) prompts `xmllint` to accept XML from STDIN (the pipe from curl).

Given a valid XPath expression, the result of this command will be exactly what is required - a value to assign to the sensor. In this case, the XPath expression will be interpreted as:

1.  Start at the root `Measurements` node
2.  Traverse down the tree into `Data`
3.  Select the `last()` `Reading` node
4.  Traverse into the `Value` node
5.  Select the `text()` (inner text) of the node

In other words, the complete command:

```sh
curl "http://api.opendata.tld/example.xml" |\
  xmllint --xpath "//Measurements/Data/Reading[last()]/Value/text()" -
```

Will return.....`11.8`. Exactly what we need!

We can now define our HomeAssistant sensor:

```yaml
sensor:
  - platform: command_line
    command: "curl \"http://api.opendata.tld/example.xml\" | xmllint --xpath \"//Measurements/Data/Reading[last()]/Value/text()\" -"
    unit_of_measurement: "C"
```
