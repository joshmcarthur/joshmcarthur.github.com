---
layout: post
title: "Configuring S3 redirect rules"
description: "S3 redirect rules are handy for maintaining links to content. In this post, I outline a couple of gotchas I found"
category: TIL
tags: [til,ops]
---

S3 supports [redirecting content in a number of ways](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html). 
In most cases, providing an XML-formatted collection of redirect rules is a good way of centralising where content is going.
Using the XML format of redirect rules is also a neat way of extending an S3 bucket with additional
behaviour by redirecting to a Lambda function or similar dynamic generation endpoint. 

Redirection rules are specified in the following basic format:

``` xml
<RoutingRules>
  <RoutingRule>
    <Condition>
      <KeyPrefixEquals>KEY</KeyPrefixEquals>
    </Condition>
    <Redirect>
      <Protocol>PROTOCOL</Protocol>
      <HostName>HOSTNAME</HostName>
      <!-- This can be left as an empty element to use the current key as the path -->
      <ReplaceKeyPrefixWith>PATH</ReplaceKeyPrefixWith>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

Within `<RoutingRules>`, as many rules can be provided as you wish. There are also alternative
conditions available, such as `<HttpErrorCodeReturnedEquals>`, which allows for a redirect if the
normal S3 response results in a particular HTTP status code - redirects of this kind can be used in
conjunction with an external application or FaaS platform to dynamically render or return content.
Examples of this I have seen include generating image thumbnails on the fly when they do not already
exist, and redirecting to a full-text search of a static site. 

One big gotcha with redirect rules that I found was not really documented anywhere was that the
`<KeyPrefixEquals>` must not begin with a leading slash. This seems a bit contrary to the path that
you are trying to match against, but is mostly in keeping with the fact that S3 keys cannot start
with a leading slash. Keep in mind that it is the _Key_ that S3 is matching against, not the web
path. 

Redirect rules cannot be used out of the box with Cloudfront, if you are using a Cloudfront
distribution to act as a CDN and SSL termination for your S3 website, however with a small
adjustment redirect rules work fine - when you configure the Cloudfront origin, simply provide the
full URL to the S3 website location, rather than selecting your S3 bucket from the typeahead
dropdown. This will cause Cloudfront to treat your S3 website as a "Custom" origin instead of an
"S3" origin, so it will forward the Location header back to the client.
