---
layout: post
title: "Quickly access Ruby Mail object parts"
description: "How to jump to a particular mimetype part of a Mail message"
category: TIL
tags: [til,rails]
---

Often, mailer specs will start with a simple assertion like
`expect(mail.body).to include "Some text in the expected email here"`. This
works for a while, but quickly breaks down when an email grows more complex,
such as having special characters causing it to be encoded as 7bit or
QuotedPrintable, having attachments, or supporting different formats (like
plaintext & HTML).

I've always tried to do various horrible things relating to traversing the parts
of the message object, and extracting the part that has a mimetype of
`text/html`. I should have known that the [Mail](https://github.com/mikel/mail)
library would have a shortcut for this!

Given a mail object, you can call
[`.html_part`](https://www.rubydoc.info/github/mikel/mail/Mail%2FMessage:html_part),
and
[`.text_part`](https://www.rubydoc.info/github/mikel/mail/Mail%2FMessage:text_part)
to access the HTML and text parts of the message respectively. Under the hood,
these helpers use
[`find_first_mime_type`](https://www.rubydoc.info/github/mikel/mail/Mail%2FMessage:find_first_mime_type),
which means you can find any other format you may support by passing the
mimetype to this helper. Note - this helper filters out attachments - if you
want to check what attachments a message has, you should use
[`.attachments`](https://www.rubydoc.info/github/mikel/mail/Mail%2FMessage:attachments)
for that.

With these helpers, the test can handle all sorts of formats and attachments
while still supporting a nice stable assertion -
`expect(mail.html_part.decoded).to include "Some text in the expected email
here"`.
