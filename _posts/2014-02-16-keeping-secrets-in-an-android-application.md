---
layout: post
title: "Keeping secrets in an Android Application"
description: ""
category: 
tags: []
---

As a (mainly) Rails developer, I'm pretty accustomed to the need for secret keeping within a server-based application, and how it gets done (typically, `config.yml`'s and/or `ENV` variables). Getting into Android though, I've had the need to integrate with [Parse](https://parse.com) to retrieve some simple data that I don't want to manage a data service for. Since I want to open source this application, it's not really enough to follow Parse's guides and just paste in my application IDs and keys - I need something more adaptable than that.

After doing a bit of reading, I've had an epiphany about Android's [neat support for Strings](http://developer.android.com/guide/topics/resources/string-resource.html) - that they're not just for internationalization. My conclusion is that a separate Strings XML file, called something like `configuration.xml`, and git-ignored, is perfect for storing secrets.

The process for doing this is very simple. In any Android application, there will be a folder somewhere called 'res' (I say _somewhere_, because Android Studio and Eclipse generate this folder in two separate places). Within the 'res' there is a 'values' folder, which normally contains a few XML files, typically containing dimensions, translations, and other generated files. 

To store secrets, simply create another XML file in 'res/values', called 'configuration.xml'. The content of this file is pretty much based on what your existing 'values.xml' file will contain - except, instead of containing internationalization strings such as button and text field labels and content, it will contain whatever secret configuration you need. An example of this file is below:

{% highlight xml%}
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="parse_application_id">xxxxxx</string>
    <string name="parse_client_secret">yyyyyy</string>
    <string name="google_maps_api_key">zzzzzz</string>
</resources>
{% endhighlight %}

Once these keys are in the file, Android will automatically merge it into your resources, where you can access them exactly as you would your normal strings. The only adaption you might need is when you literally need a string, rather than a string resource (which is an `int` pointing to the resource) - for example, the initialization of the Parse library - you can simply use `getString()` to get a string of your resource, like so:

{% highlight java%}
Parse.initialize(
    this, 
    getString(R.string.parse_application_id),
    getString(R.string.parse_client_secret)
);
{% endhighlight %}

If you need your keys in another XML file (for example, your 'AndroidManifest.xml'), you don't need to worry about using `getString()` - you can just use the XML notation for accessing project resources - for example:

{% highlight xml %}
<meta-data
    android:name="com.google.android.maps.v2.API_KEY"
    android:value="@string/google_maps_api_key"/>
{% endhighlight %}

Since your secrets are now in an individual file, they're simple to ignore in your source control system (for example, in Git, you would add this to the '.gitignore' file in your repository): 

{% highlight sh %}
echo "**/*/res/values/configuration.xml" > .gitignore
{% endhighlight %}

This process is not bulletproof. As resources, they are somewhat more vulnerable to decompilation of your application package, and so they are discoverable if somebody really wants to know them. This solution does, however, prevent your secrets just sitting in plaintext in source control waiting for someone to use, and also has the advantage of being simple to use, leveraging Android's resource management system, and requiring no extra libraries.

#### Note:

I've seen encryption suggested around the place as an additional level of security combined with storing secrets in a strings file. The advice on that seems to be that it's pointless, unless you can find a way to not have your encryption and decryption routine within your code, since the knowledge of _how_ your secrets were encrypted is generally enough to decrypt the secret.