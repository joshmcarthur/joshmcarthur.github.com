---
layout: post
title: "GWRC Matangi Train Numbering System"
description: "Breaking down the numbering system for Matangi trains in the Wellington Region"
category: TIL
tags: [til,transit]
---

> Note: This numbering system is known as "TMS" (even though TMS stands for "Traffic Management System") 
> of which the numbering system is just a small, bespoke part.

I travel on the Greater Wellington [Metlink](https://www.metlink.org.nz) transit system nearly every
weekday, and am often curious about what train I happen to be travelling on. I was recently checking
out the [Wikipedia
page](https://en.wikipedia.org/wiki/New_Zealand_FP_class_electric_multiple_unit#Naming_and_classification)
for the FP 'Matangi' units introduced in 2010, in particular how the numebering system worked. I had
always just assumed that the numbers following the classification 'FP' and 'FT' were somehow
sequential, so my curiousity was piqued to investigate the system further.

To break down the number of a particular unit, it needs to be divided into 4 parts:

#### 1. Classification

This is a 2 or 3 character sequence. For the Matangi units, this is either 'FT' or 'FP' depending on
whether the car is powered or not (only a single car in the set is powered - the other is a
'trailer'). 

#### 2. Series

The first number in the sequence following the classification is used to identify the series - 1000
series, 2000 series and so on.

The initial series of the Matangi production units is 4000. A follow up 5000 series was introduced
in 2015-2016, with a few minor improvements such as LED lighting (being retrofitted to the 4000
series). 

#### 3. Train Number

The series and following two numbers makes up the train number - this is what would be typically
used to identity a single unit. According to the Series, the train number for Matangi units
consistently starts with either '4' or '5' (which is how the two generations may be differentiated).

#### 4. Check Digit

The final number is a check digit, used to verify the classification and train number. The check
digit was certainly the hardest to research, being referred to in nearly all places as just that -
"check digit". I was fortunate to find the [nzrailphotos.co.nz TMS Calculator
Utility](https://nzrailphotos.co.nz/utilities/#tms-calc), which I could take a peek at the code for
to see how it was calculated.

The check digit is calculated as follows:

1. Letters are converted to a numeric format. This means converting them to their character codes
   (According to ASCII, A-Z is 65-90), and then subtracting 64 to zero-index them. To ensure the
   placement is correct, they are added to the list of numbers to sum zero-padded - e.g. '8' would
   be added as '0', '8', and '20' would be added as '2', '0'.
2. Numbers that already fall between 0 and 9 (48-57 in ASCII) have 48 subtracted to zero-index them,
   and are then added directly to the list to sum. Zero-padding isn't a concern, since the number is
   always between 0 and 9.
3. The 'sum' of the numbers is now calculated. Each number in the list above is squared, and then
   multiplied by it's position in the list (e.g. a list containing 0, 6, 0, 2 would work out being
   `(0 * 0 + 36 * 1 + 0 * 2 + 4 * 3) = 48. 
4. The remainder of the sum divided by 11 is calculated, and is ready to use as the check digit. 

The reason this calculation is so complex is because the check digit ensures that the numbers and
classification is correct, and also in the correct order. A train number with a different
classification or number will not have the same check digit, and a train number in an incorrect
format (too long/short), will also not have the same check digit.

Since the explanation above is quite wordy, here are some examples:

* `FT4247`. Train number is `FT424`, sum list is `0, 6, 2, 0, 0, 4, 2, 4`, sum is 260, check digit
  is 7. Number verifies.
* `FP4247`. Train number is `FP424`, sum list is `0, 6, 1, 6, 4, 2, 4, sum is 326, check digit is
  7. Number verifies.
* `FP5148`. Train number is `FP514`, sum list is `0, 6, 1, 6, 0, 5, 1, 4`, sum is 389, check digit
  is 8. Number verifies.

