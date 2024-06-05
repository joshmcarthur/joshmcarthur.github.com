---
title: Logging the DOM state of an element with testing-library
---

I'm sure this is all over testing-library documentation, but I haven't had to do
this before, so I think it's worth a quick post about.

If I'm writing a
[`testing-library`](https://www.npmjs.com/package/testing-library) assertion,
every now and then the test won't pass, because the element I expected to be
present, was not. Usually, when this happens, a snippet of the DOM will be
output, but will be truncated - sometimes the element that has not matched is in
the truncated version, and sometimes it is not.

So that I can see the full DOM state, I've come across `screen.debug()`. This
is, I suspect, what testing-library calls when a DOM matcher test fails, but it
has some useful options which can help debug a test.

First of all, the element to log can be passed. This is useful if you have a
selector you can match, because it allows _just_ that element to be logged,
without any of the noise before, after, or around it:

```javascript
screen.debug(screen.getByTestId("test-container"));
```

Obviously you can pass any DOM query function you want there, including if you
need to `await` an element with `findBy*`, or even direct DOM lookups with
`document.querySelector` (though my eslint rules in this case don't permit me to
do this).

If the DOM contents are still too long to see the problem, you can also pass
options to `debug` with the element - `maxLength` is handy, since it lets you
override the length at which the contents will be truncated.

```javascript
screen.debug(screen.getByTestId("test-container"), { maxLength: 10000 });
```

Less useful for easy debugging, you can also pass extra options to dictate how the output should be rendered - for example, turning off syntax highlighting.
