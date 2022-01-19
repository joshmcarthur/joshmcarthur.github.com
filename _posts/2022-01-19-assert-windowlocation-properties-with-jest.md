---
layout: post
title: "Assert window.location properties with Jest and jsdom"
description: "window.location properties and functions are protected in Jest with jsdom. Here's how to assert against them"
category: TIL
tags: [til, jest, testing, javascript]
---

I have a React component that is part of a wider Ruby on Rails application. It fetches a record,
and if the record does not exist, it redirects to the server-rendered 404 page.

> Unfortunately, while the user will see the 'not found' page, the HTTP status code will be 200 OK
> by default, because this page is static. Best practise would be to define a location block in your web server (Nginx, Apache, IIS etc) to respond with a 404 status when this static file is requested.

Having made this component, I'd like to add a Jest assertion that when the record is absent, the
component does not render but instead tells the window to change it's location.

Unfortunately, a naieve assertion does not work the way I expected:

```javascript
it("navigates to /404 when the record is absent", () => {
  render(<MyComponent record={undefined} />);
  expect(window.location.pathname).toBe("/404");
});
```

Jest tells us that we can't use `window.location` in our component, because jsdom can't navigate:

**Error: Not implemented: navigation (except hash changes)**

That's fair enough! Adding navigation would be a big increase in scope for jsdom, and I can't blame anyone for not supporting this.

The trick to getting this to work is to redefine the `location` property on the `window` object in our test, so that we are using and asserting against an object that we control:

```javascript
it("navigates to /404 when the record is absent", () => {
  // jsdom doesn't allow us to 'navigate' from a component, because how would that work?
  // Since we don't need to navigate, but just assert that navigation _would_ have occurred,
  // we can replace window.location with a URL, which has a pathname property we can assert
  // against
  Object.defineProperty(window, "location", {
    value: new URL("http://example.com"),
    configurable: true,
  });

  render(<MyComponent record={undefined} />);
  expect(window.location.pathname).toBe("/404");
});
```

You might notice that we're using a
[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) object there. Why
is that? Well, it turns out that `window.location` shares many properties with
[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL). Not _all_, and
that's important to know - especially for things like events and functions like
`reload()`, but if you're trying to assert that a property of the location
changed, this is perfect. We replace the `window.location` property with a new
URL object, change a property of that URL within our component, then assert that
the property changed to the value we expect it to.

You might also notice that we're passing an option to `defineProperty` -
`configurable: true`. Adding this option means that other tests can change the
value of this property later on the test. It's also important to note that we're
_replacing_ `window.location` from when this test runs onwards. To me, this is
OK, since `window.location` raises errors in jsdom and doesn't work the way we
expect anyway, but if you want to avoid side effects, you can assign the
original `window.location` to a variable, then assign the property back at the
end of your test - or put all this in a `before`/`after` hook in your test file
or suite.

##### References

1. https://stackoverflow.com/questions/54021037/how-to-mock-window-location-href-with-jest-vuejs
2. https://www.benmvp.com/blog/mocking-window-location-methods-jest-jsdom/
3. https://remarkablemark.org/blog/2018/11/17/mock-window-location/
