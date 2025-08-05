---

title: Connecting to a locally-running app with Hotwire Native
category: TIL
--

I've just started a new [Hotwire Native](https://native.hotwired.dev) application. The [Getting Started](https://native.hotwired.dev/android/getting-started) docs for Android use a deployed domain name, so while the demo app worked just fine, I had a bit of trouble figuring out how to connect to my locally-running web app from an Android emulator. In my case, it was a Rails app, but any other web framework would also have this problem.

There were two useful things I found:

1. Android emulators make your computer available at `10.0.2.2`. This means that if you run your web app on port `3000`, you can connect in a browser at `http://10.0.2.2:3000`. Neat!
2. If you are connecting to insecure origins, you need to flag this in your `AndroidManifest.xml` - specifically, you need to add `android:usesCleartextTraffic="true"` to the `<application>` tag.

With this configuration in place, I was able to set up Hotwire Native to connect in debug builds to my locally-running web applicaiton, and I was off!
