---
layout: post
title: "TIL: toLocaleString() for currency formatting"
description: "On supported browsers, toLocaleString provides a convenient way to format currencies and other number formats."
category: TIL
tags: [til,technology,javascript]
---

Yesterday I learned about `toLocaleString`, a Javascript function defined on the `Number` prototype since ECMAScript 3. It has had a couple of iterations of arguments, but the version supported by most browsers provides a very convenient API for formatting currency in a user's locale:

## Examples:

> Note: Wherever I have passed `undefined` as the first argument to `toLocaleString`, this simply means that I am expressing no preference for a particular locale. In this case, the browser will use the system locale.

#### Format an amount in USD using the user's locale (en-NZ for me)

``` javascript
var number = 1234567
console.log(
  number.toLocaleString(undefined, { 
    style: "currency", 
    currency: "USD"
  })
);
// => US$1,234.57
```

#### Format an amount in USD using a defined locale

``` javascript
var number = 1234.567
console.log(
  number.toLocaleString("en-US", { 
    style: "currency", 
    currency: "USD"
  })
);
// => $1,234.57
```

#### Format an amount in NZD using a defined locale

``` javascript
var number = 1234.567
console.log(
  number.toLocaleString("en-US", { 
    style: "currency", 
    currency: "NZD"
  })
);
// => NZD$1,234.57
```

#### Format an amount in NZD using European formatting 

``` javascript
var number = 1234.567
console.log(
  number.toLocaleString("de-DE", { 
    style: "currency",
    currency: "NZD"
  })
)
// => NZD$1.234,57
```

#### Format an amount in Pounds, rounded to a whole number

``` javascript
var number = 1234.567
console.log(
  number.toLocaleString(undefined, { 
    style: "currency", 
    currency: "GBP", 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0
  })
);
// => £1,235
```

#### Format an amount in NZD, using the default locale (en-NZ for me), rounding to a whole number when possible and otherwise using 3dp.

``` javascript
var roundNumber = 1234.0;
var fractionalNumber = 1234.5678;
var options = { 
  style: "currency", 
  currency: "NZD", 
  minimumFractionDigits: 0, 
  maximumFractionDigits: 3
};

console.log(roundNumber.toLocaleString(undefined, options))
// => $1,234

console.log(fractionalNumber.toLocaleString(undefined, options));
// => $1,234.568
```

### Browser support

According to the [MDN documentation for `toLocaleString`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString), browser support is good across the board for "Basic support" (this is formatting a number for a particular locale, but not in a particular style, e.g. "currency"). Support for `locales` and `options` is good for all mainstream browsers.

While MDN's compatibility chart indicates no support for `locales` and `options` on Android, my testing showed that it is in fact supported in Chrome running Android 6.0.1, and I suspect down to ~ Android 5 when the system webview was replaced by Chrome. 

For those looking to work in browsers that do not support non-Basic usage of `toLocaleString`, the MDN page has feature detection functions that can be used to fallback to a different implementation. I created a fallback called `formatCurrency`, which used the `toLocaleString` function directly if possible, falling back to concatenating the amount and currency.