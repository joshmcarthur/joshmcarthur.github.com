---
layout: post
title: "Mocking Python requests library"
description: "Using @unittest.mocks to stub out HTTP interactions using the requests library"
category: TIL
tags: [til,technology,python]
---

One of the toughest part of writing tests is how to go about handling dependencies on 
external dependencies. Aside from databases, probably the most common type of external dependency is
a network request - usually HTTP (or HTTPS). 

[`requests`](http://docs.python-requests.org/en/master/) is a very, very popular library for
performing HTTP requests in Python. It's popular because of its easy to use API and simple approach
to performing requests that can otherwise prove to be quite complex with lots of edge cases. The
example from the homepage says it all really:


``` python
>>> r = requests.get('https://api.github.com/user', auth=('user', 'pass'))
>>> r.status_code
200
>>> r.headers['content-type']
'application/json; charset=utf8'
>>> r.encoding
'utf-8'
>>> r.text
u'{"type":"User"...'
>>> r.json()
{u'private_gists': 419, u'total_private_repos': 77, ...}
```

So, writing the code to perform an HTTP request is nice and simple. How about testing? Well, it
really depends on your approach. 

One option is to just let the requests happen - maybe to a testing
or staging environment. This is obviously the easiest, but also requires such an environment to
exist, to be accessible from anywhere, and requires the requests to consistently return the same
results with no side effects. 

Another option is to create a fake endpoint that you hit instead. In
Ruby, I have done this with [sinatra](http://sinatrarb.com/) - and I guess in Python you would use
something like [flask](http://flask.pocoo.org/). This can work well if the requests and responses
are quite complex (maybe lots of specific params, headers and bodies), but also introduces a server
taht needs to be maintained and kept up to date. There is a certain time penalty just to create such
a server as well, especially how to fake side effects. It's easier than it sounds to accidentally
end up re-inventing the system that was being faked out in the first place!

Finally, there is mocking. Mocking involves intercepting calls at the code layer, rather than the
network layer. This is useful because you don't have the overhead of interacting with an external
service, but still have full control over the result - for example, you can mock out your network
request to see how your code reacts to all sorts of edge cases - network errors, partial responses,
SSL errors - the list goes on. There is what seems to be a popular library available specifically
for mocking calls to the `requests` library called, appropriately,
[`responses`](https://github.com/getsentry/responses). I would recommend this library if you're
after wide-ranged or complex HTTP mocking. The remainder of this post, I'm going to be talking about
mocking HTTP requests using plain ol' `@unittest.mock` methods that are built right into Python.
This is really only suitable for simple requests, or a contained set of more complex requests, but
is a lot easier to reason with and maintain, and saves you adding a dependency to your application.

`unittest.mock` allows you to replace objects and classes that your code under test relies on. You
can assert that methods are called with arguments, add side effects to methods being called, and
change the value that a method will return. If you go back and read about some of the different
things that can go wrong with HTTP requests, you can maybe envisage how some of these mocking
capabilities can be used to test how your code reacts to some of these scenarios.

The easiest way to mock out requests is to use the
[`@patch`](https://docs.python.org/3/library/unittest.mock.html#unittest.mock.patch) decorator. This
decorator accepts the module and method to mock, and will build the mock for you, passing it as an
argument into your test. 

Heres an example:

``` python
from unittest.mock import patch
from unittest import TestCase

class ApiClientTest(TestCase):

  @patch("requests.get")
  def test_standard_request(self, requests_get):
    # ... test goes here
```

With the mock available, you can change whatever you like:

* You can change the status code return value: `requests_get.status_code.return_value = 200`
* You can introduce a side effect: `requests_get.side_effect = Exception("Request failure!")`

As well as changing the behaviour of the mocked code, you can also add assertions that a method has
been called the way you expect. Using the example posted at the top of this post, this assertion
could be something like:

``` python
class ApiClientTest(TestCase):

  @patch("requests.get")
  def test_request(self, requests_get):
    requests_get.assert_called_with('https://api.github.com/user', auth=('user', 'pass'))
    
    # Call your code which performs a request here, e.g.:
    requests.get('https://api.github.com/user', auth=('user', 'pass'))
```

Quite often, after making a request, your code may have a dependency on the _response_. This isn't a
problem at all, but you might want to make a fully-fledged `requests.Response` class, like so:


``` python
from requests import Response
from requests.exceptions import HTTPError
from unittest.mocks import Mock

class ApiClientTest(TestCase):
 
  @patch("requests.get")
  def test_request(self, requests_get):
    successful_response = Mock(Response)
    successful_response.status_code = 406
    requests_get.return_value = successful_response

    self.assertEqual(requests.get("/").status_code, 406)

  @patch("requests.get")
  def test_failed_request(self, requests_get):
    failed_response = Mock(Response)
    failed_response.raise_for_status.side_effect = HTTPError()
    requests_get.return_value = failed_response

    self.assertRaises(HTTPError, requests.get, '/')
```

These are simplistic examples. Obviously with full acccess to the response, your options are fairly
unlimited.

I have used this approach a number of times now and it has worked very well for me. Without adding
complexity or an additional dependency, I am able to test both success and failure scenarios of
making HTTP requests without adding too much magic or indirection. It's quite easy to see how the
requests are being mocked, and the return values and side effects that we can expect from these
requests. 
