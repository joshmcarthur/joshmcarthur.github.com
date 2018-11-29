---
layout: post
title: "Exercism Strain: Collaborative implementation and benchmarking"
description: "A collaborative exercise implementing the Strain Elixir exercism exercise."
category: TIL
tags: [til,technology,elixir]
---

This post covers an incremental implementation of the Exercism ["strain"](https://exercism.io/tracks/elixir/exercises/strain) exercise
that I worked on collaboratively with one of my colleagues at [Ackama](https://www.ackama.com),
Daniel Jauch. 

The Strain exercise brief is to implement `keep` and `discard` functions within an Elixir module
named `Strain`, without using the `Enum.filter` module, for example:

``` elixir
iex> Strain.keep([1, 2, 3], fn e -> e < 10 end)
[1, 2, 3]

iex> Strain.keep([1, 2, 3], fn e -> e < 3 end)
[1, 2]

iex> Strain.discard([1, 2, 3], fn e -> e < 3 end)
[3]
```

### First implementation: Use other Enum methods, just not `filter`

Our first stab at this was to assume that since we couldn't use `Enum/filter/2`, there _were_ Enum
methods that could be used to get an equivalent result. Here is what we came up with:

``` elixir
defmodule Strain do
  def keep_enum(list, fun) do
    list
    |> Enum.map(&(fun.(&1) && &1))
    |> Enum.reject(&(!&1))
  end
end
```

This worked, with all tests passing, so we submitted that to Exercism. Yay, done!
But then we took a look at some of the community solutions, and realised that our initial foray into `Enum` was a
little misguided, since there was an Elixir feature we completely didn't know about we could use instead.

### Second implementation: Comprehensions

[Elixir Comprehensions](https://elixir-lang.org/getting-started/comprehensions.html) are a bit of
syntactic sugar over Enumerables that allow for some handy brevity when processing Enumerable data.
Comprehensions support a generator, and a filter. The generator is the first "argument" to the
comprehension and is required. The filter is an optional second argument, and can be used to exclude
non-matching values from the list. Is all this starting to sound exactly like how `keep` and
`discard` should work? We thought so as well!

``` elixir
defmodule Strain do
  def keep(list, fun), do: for x <- list, fun.(x), do: x
end
```

Much, much simpler, and even more readable in my opinion, once we understood what the two arguments
passed to the comprehension did. The implementation of `discard` is exactly the same, just the
inverse result from the check function - `!fn.(x)` instead of `fun.(x)`.

So, as an Exercism exercise, we were happy with this - from a 5 line function down to a single line. 

Then we started wondering - if `Enum.filter` is what we would normally use for this, and we have
come up with two different implementations of the exercise - what is the speed difference between
them? Only one way to find out!

### Third implementation: Creating a mix project

To perform some benchmarking, we found a Hex package called
[benchee](https://hex.pm/packages/benchee) that looked like it would suit our needs nicely. Before
we could add this dependency though, we needed to package our current code into a Mix project!

We started from the Exercism exercise folder:

``` sh
ls *
strain.exs
strain_test.exs
README.md
```

We made a new Mix project in this folder:

``` sh
mix new strain_bench
* creating README.md
* creating .formatter.exs
* creating .gitignore
* creating mix.exs
* creating config
* creating config/config.exs
* creating lib
* creating lib/strain_bench.ex
* creating test
* creating test/test_helper.exs
* creating test/strain_bench_test.exs

Your Mix project was created successfully.
You can use "mix" to compile it, test it, and more:

    cd strain_bench
    mix test

Run "mix help" for more commands.
```

And then we copied our exercise files into the project:

``` sh
cp strain.exs lib/strain.exs
cp strain_test.exs test/strain_test.exs
```

We needed to make a few changes to our files:

* We needed to remove or comment out the first three lines of the test, since this contained some
  Exercism-specific helper code that tried to load the main Elixir file from a particular location
* We needed to rename our `strain.exs` in the `lib` folder to `strain.ex` so that Mix would compile
  this file and it could be tested.

With these two steps done, we could check our tests still passed:

``` sh
mix test
..............

Finished in 0.1 seconds
1 doctest, 13 tests, 0 failures
```

Great! Time to benchmark.

### Final implementation: Benchmarking

First, we needed to add that dependency. Easily done - the [benchee page on
Hex.pm](https://hex.pm/packages/benchee) has a dependency block to add to our `mix.exs`

``` elixir
# mix.exs
defp deps do
  [{:benchee, "~> 0.9", only: :dev}]
end
```

Then we download the dependencies: `mix deps.get`

After that, we followed a [Elixir School guide on using
Benchee](https://elixirschool.com/en/lessons/libraries/benchee/). First step - create our benchmark.


``` elixir
# benchmark.exs
list = %w(apple zebra banana zombies cherimoya zelot)
checker = &String.starts_with?(&1, "z")

Benchee.run(%{
  "strain.comprehension" => fn -> Strain.keep(list, checker) end,
  "strain.enum" => fn -> Strain.keep_enum(list, checker) end,
  "enum.filter" => fn -> Enum.filter(list, checker) end
})
```

We had three implementations we wished to test:

* **`strain.comprehension`** - our one line comprehension function.
* **`strain.enum`** - our Enum function (we renamed this to `keep_enum` so we could benchmark it
  from the same module)
* **`enum.filter`** - the normal `filter` function built into the `Enum` module.

To run these benchmarks, we simply needed to `mix run benchmark.exs`, which benchmarks each function
in the map a number of times and then reports results. During the benchmarking, we saw some warnings
explaining that our functions were a bit _too_ fast and our benchmarking results might have
deviation across runs. We "fixed" this by copy-pasting our list until it was larger, but we figured
the warning could mostly be ignored since we were really just interested in a rough measurement.
Here's what we found.


### Results and Summary

Environment:

```
Operating System: macOS"
CPU Information: Intel(R) Core(TM) i5-3230M CPU @ 2.60GHz
Number of Available Cores: 4
Available memory: 8 GB
Elixir 1.7.3
Erlang 21.0.6
```

Test 1:

```
Comparison:
enum.filter                16.71 K
strain.comprehension       13.76 K - 1.21x slower
strain.enum                11.53 K - 1.45x slower
```

Test 2:

```
Comparison:
enum.filter                16.03 K
strain.comprehension       10.77 K - 1.49x slower
strain.enum                 4.79 K - 3.34x slower
```

Test 3:

```
Comparison:
enum.filter                15.70 K
strain.comprehension       13.43 K - 1.17x slower
strain.enum                 9.57 K - 1.64x slower
```

Unsurprisingly, `Enum.filter/2` is fastest - this makes sense, since Enum functions are widely used
and I expect they have been heavily optimised. 

Also unsurprisingly, our Enum implementation of `keep` was the slowest. We expected this, since we
were doing two complete iterations of the list - once for the `map`, and once for the `reject`. This
function also had a lot more deviation in speed over multiple benchmarking runs - probably just
because there's more going on in that function to get delayed.

Our comprehension sat very nicely, slightly slower than `Enum.filter`, but not by a huge margin - on
average, 1.3 times slower, but still consistently faster than `keep_enum`. I would expect that the
benchmarking time on `Enum.filter` and `keep` (with comprehension) would scale pretty linearly as
well, wheras the `keep_enum` implementation would be a bit more unpredictable due to it's additional
complexity.

Overall, we came to the conclusion that `Enum.filter` is the obvious winner when filtering a list.
Not terribly surprising to us! We did find that a list comprehension is still worth considering
though, since it's an extremely capable way of performing map/reduce type operations in a succint
way. We also wrapped up the exercise with a real appreciation for how we maybe shouldn't jump
straight into `Enum` every time just because it's mentioned in the exercise scenario.


