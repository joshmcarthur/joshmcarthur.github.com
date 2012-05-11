---
title: Spree Hosted Gateway
layout: post

type: regular
comments: true
---

Spree Hosted Gateway is my second 'big' extension - one of the ones that isn't
just adding one or two bits of nice functionality, but actually and end-to-end
solution to add something that I think would be useful to a broad range of
Spree developers (My first was spree-import-products, see my post on it here).
Spree (for those of you unfamiliar with it), is an open-source eCommerce
framework written in Ruby on Rails, and has recently been upgraded to Rails 3,
which has enabled extensions to now be packaged as Rails engines, making them
far easier to create, implement and share. Out of the box, Spree is able to
provide much of what a basic online store requires, but something I have felt
is missing is support for alternative payment methods that are much more
rudimentary than those catered for by Railsdog's_fork_of_ActiveShipping.Â 
Inspired by a project I was working on at 3Months, I decided to develop an
extension that provided a new type of Payment Method (Alongside Cheque and
Creditcard) - External (Or Hosted) Gateway - this type of payment method was
characterized in the following ways:
    * Redirection - the customer was required by the gateway to be redirected
      to an off-site form to make payment.
    * Tracing the payment and order: attributes required for payment (Amount,
      etc.) were gathered by the payment gateway from POSTed form data.
    * Communications: there was no type of complex back-and-forth between Spree
      and the gateway provider behind the scenes - information was transmitted
      to the gateway, and all Spree is able to do from that point is listen for
      a postback and collect any information from that.
These type of gateways are (unfortunately) quite prevalent, especially around
small-to-medium independent companies - they tend to be cheaper than more
widely-known solutions, at the expense of a more reliable and secure
transaction for the customer.
Spree Hosted Gateway, as I have mentioned, hooks into Spree in the form of
registering itself as a Payment Method that can be configured from the admin
interface. After seeing all theÂ arbitraryÂ information that I was required to
POST to the payment gateway I was testing against, I also made it easily
extendable, and used Spree's preferences system to allow any number of key-
value pairs to be created (Which could be modified in the Spree Admin UI),
which are automatically posted to the payment gateway when I customer is
redirected (Unless the preference key is added to the exclusion list, of
course!).
I conjunction to the 'transmit' function of the extension, I have also
implemented a kind of 'landing pad' for postbacks from the Payment Gateway to
hit. When this happens, the extension is able to detect whether the transaction
was successful or not, and continue processing the order. If the customer has
made an payment that is not sufficient to cover the cost of the order they are
redirected back to the payment page, and if the transaction was not successful,
an error message is presented to them.
All in all, I'm happy with this extension - it was a great way to learn about
how Spree itself handles payment methods, different types of gateway and
payment validation and handling, and I'm hoping this extension will help out
some of the Spree developers out there working on smaller stores that don't
need such a large (expensive) gateway.

