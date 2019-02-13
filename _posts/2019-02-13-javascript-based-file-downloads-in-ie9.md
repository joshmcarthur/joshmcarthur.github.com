---
layout: post
title: "Javascript based file downloads in IE9"
description: "How to download files from Javascript in IE9"
category: TIL
tags: [til,technology,javascript]
---

Getting feature parity on Internet Explorer is never very fun, or easy. I recently worked on a
project where we needed to support inline downloads - specifically, a generated CSV string, as a 
file in all greenfields browsers as well as IE9-11. 

Fortunately, IE 10 and 11 support the [`Blob` API](https://developer.mozilla.org/en/docs/Web/API/Blob), 
which make downloads pretty simple using the ['msSaveBlob` non-standard
API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/msSaveBlob). 

IE9 has no such support though - either for Blob building, or for saving said blobs. Fortunately,
there is a convenient workaround, using simple document body manipulation and the `SaveAs`
execCommand that can be sent to a frame. 

Here's the snippet:

``` javascript
function legacyBrowserSave(content, filename) {
  const frame = document.createElement("iframe");
  document.body.appendChild(frame);

  frame.contentWindow.document.open("text/html", "replace");
  frame.contentWindow.document.write(content);
  frame.contentWindow.document.close();

  frame.contentWindow.focus();
  frame.contentWindow.document.execCommand("SaveAs", true, filename);
  document.body.removeChild(frame);
  return false;
}
```

This snippet should be wrapped in a browser or feature detection script, since saving a blob is
supported in nearly every other browser.

Just to step through this solution within the function body, line by line:

On line 1, we create a new `<iframe>` element.

On line 2, we attach this new element to the document body. The iframe will not display as it has no
width or height.

On line 4, we ["open"](https://developer.mozilla.org/en-US/docs/Web/API/Document/open) the document.
The second argument to this function, `"replace"`, indicates that a new history item should not be
added (this isn't an actual navigation after all). 

On line 5, we write the file content into the iframe, and then close the document on line 6. (This
`open`, `write`, `close` operation is equivalent to doing `document.write` except it resets the
existing content.)

On line 8, we focus the window within the frame. This is necessary for the next operation on line 9,
when we pass an
[`execCommand`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) to the
frame's window, with the argument of "SaveAs". (`execCommand` options are not standardized across
browsers. In this case, `SaveAs` is specific to Internet Explorer). The `true` argument provided
here is to indicate whether the default UI should be shown or not and has no effect - it's just a
required arg so that we can pass the filename as the third argument.

On line 10, we remove the frame from the document.body, since the user has now been presented with a
dialog to save the file, and the frame is no longer required.

The `return false` is just to prevent the event from bubbling, since we have handled it. 

Here's a demo of this in action:


![IE9 download demo](http://g.recordit.co/ja8gh29HcN.gif)

[Source Gist](https://gist.github.com/joshmcarthur/114357808ff67a8729f3857ac18d3e6d)

