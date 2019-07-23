---
layout: post
title: "Broadcast receiver pattern"
description: "A convenient pattern to use for broadcast receivers with Android"
category: TIL
tags: [til,technology,android]
---

I have recently had the chance to get stuck back into some native Android development. One of the
things I really enjoy about working with the Android framework is that I get the chance to explore
new patterns, and patterns that I have used before for Ruby, but not yet in Java. 

One of these new patterns is the idea of a broadcast receiver. Broadcast receivers are a core part
of the Android framework, however receivers are triggered outside the cotext of an application
activity or fragment, so it can be a little unclear how to trigger something to happen in an
activity (such as updating a UI component) when an intent is received.

The best example of this pattern is a code snippet. The following class is one I added to the NZSL
Dictionary Android application. It registers and receives intents from the `DownloadManager` system
component - specifically, when a download completes with a success or failure state
(`DownloadManager.ACTION_DOWNLOAD_COMPLETED`), or when the notification that the system shows when
the download is completed is clicked (`DownloadManager.ACTION_NOTIFICATION_CLICKED`).

{% highlight java %}
public class DownloadReceiver {
    private DownloadCallback callback;

    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (callback == null) return;
            String action = intent.getAction();

            switch (intent.getAction()) {
                case DownloadManager.ACTION_NOTIFICATION_CLICKED:
                     callback.onDownloadNotificationClicked();
                     break;
                case DownloadManager.ACTION_DOWNLOAD_COMPLETE:
                     callback.onDownloadCompleted();
                     break;
            }
        }
    };

    public void registerContext(Context context, DownloadCallback callback) {
        this.callback = callback;
        IntentFilter filter = new IntentFilter();
        filter.addAction(DownloadManager.ACTION_NOTIFICATION_CLICKED);
        filter.addAction(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        context.registerReceiver(receiver, filter);
    }

    public void unregisterContext(Context context) {
        callback = null;
        context.unregisterReceiver(receiver);
    }

    public interface DownloadCallback {
        void onDownloadCompleted();
        void onDownloadNotificationClicked();
    }
}
{% endhighlight %}

This class exposes two core methods - `registerContext` and `unregisterContext`. These methods are intended to be connected to the lifecycle methods of an activity or fragment - specifically, `onPause` and `onResume`. 

`registerContext` accepts two arguments - the context to use, and the callback class implementing the `DownloadCallback` interface. These arguments can _normally_ be set to the same value - the activity or fragment wanting to receive messages when a relevant download action occurs.

`unregisterContext` simply accepts a the single context to use to disable the broadcast receiver. No `AndroidManifest.xml` changes are necessary, since the receiver is connected and disconnected as `registerContext` and `unregisterContext` are called. 

Within the broadcast receiver, it is also possible to do something else with the value, such as caching it in a class-private field so that `registerContext` can return a value immediately to the subscriber without waiting for the broadcast intent to be triggered. An example of when I have found this useful is in a `NetworkManager`, to detect whether there is an active internet connection or not.

---

The main reason I like this pattern is that it abstracts away just about any kind of behaviour that may be received from a broadcast intent. This can be more than just system broadcasts, as other apps can also emit intents that can be listened for and intercepted.

When an intent is received by a class following this pattern, it can be parsed, validated, and otherwise repackaged before being passed to the subscribing class via a consistent interface that is abstracted away from exactly _how_ the data was received. Nice!
