---
layout: post
title: "The String Calculator Kata In Elixir, Plus Elixir First Impressions"
permalink: "string-calculator-elixir"
---

**TL;DR** - The String Calculator kata was fun to write in Elixir, and at first glance, the language feels like what I'd want a fully-functional version of Ruby to be, and the ecosystem is very developer-friendly. Exciting!!!

---

Since Elixir hit 1.0 a few weeks ago, I've been getting more and more antsy to dive in and write something with it. Since the [String Calculator kata](http://osherove.com/tdd-kata-1/) is my go-to for almost any contrived programming activity, I had an easy place to begin. After a false start earlier this week, I decided to really dive in today. [You can read through the result here](https://github.com/jtrim/string_calculator_ex).

My first impressions of the language and ecosystem are nothing less than glowing. <!--\-->This is going to sound like a Rubyist talking (and it is...), but Elixir feels a lot like Ruby[*](#footnote1) (not really in a feature kind of way, but more in the way I felt the first time I wrote Ruby code that actually did something.) However, Ruby has been around for awhile, and even had been when I started using it. Given the relatively short amount of time the language has been in serious development, I'm immensely impressed with what Elixir is today.

**Here are a few of my initial takeaways:**

#### Function Composition, or The Magical |> Operator

In probably every version of this kata I've done, the `add` function ends up being an ugly collection of "do this, then that, then another thing, then some more stuff, then sum the result". This time around was no exception:

<script src="https://gist.github.com/jtrim/46583dfe10e01ccdebce.js"></script>

Gross, right? With my recent toying with Haskell, it was right about here where I really wanted to compose a series of functions to clean this up.

It's not obvious anywhere that I found, but in the documentation for the `Kernel` module, there's an operator called `|>`, or the 'pipe' operator. In practice, this feels a lot like unix pipes, where the result of some execution is fed as an input in the next pipe-delimited action. Here's a composed version of my `add` function:

<script src="https://gist.github.com/jtrim/47c8d59c2d26c6f9c566.js"></script>

Much better! That could also have been combined onto one line, ala `this |> that |> those`, but the line breaks express things nicely.

This feature is HUGE for me, and is one of many things I wish Ruby had[*\*](#footnote2). And you know what the great thing is? The Elixir language provides facilities to **extend the language itself**. This operator and its behavior is something I could have written for myself (I'm catching myself as I'm writing this - I could actually be wrong about Ruby here. This might be possible in Ruby, but it likely wouldn't be pretty _or_ efficient). Or extended for myself, as [has already been done](https://github.com/batate/elixir-pipes).

So why have I gone and used the word "Magic"? Let's look at the application of `map` in my example:

```elixir
|> map(&to_integer/1)
```

This says "feed the previous evaluation into `map`, using `to_integer` as the iterator function. But wait\...`map`'s function signature reads something like: `map(collection, fun)`. Not only have we called `map/2` with one argument, but it's the first argument. The signature of `map` has two arguments, and the iterator function is the second argument! While I have some guesses, I don't exactly know how Elixir knows to interpret this correctly. I'll likely post again once I know for sure what's going on.

#### ExUnit is Intuitive

I've goofed around with EUnit for Erlang, HUnit for Haskell, and probably others that I can't remember. In more cases than not, I remember being left with a bulky and unintuitive feel from the seemingly common testing libraries in other languages. In contrast, ExUnit feels pretty natural to write. Here's a short test module for my `Delimiter` implementation:

<script src="https://gist.github.com/jtrim/0261be657b3b75c4be84.js"></script>

I don't really have much more to say on this, which, in the case of testing libraries, is a good thing. If I could stand here and talk to you all day about all the bells and whistles my hammer has to help me drive nails, it's probably quite a bit more than just a hammer. ExUnit is just a hammer, and it's a pretty good one by my early measure.

#### The Documentation is Great

Just go [browse them](http://elixir-lang.org/docs/stable/elixir/index.html). Better yet, go write something and actually _use_ them. I found them to be clean, readable, and as informative as I wanted them to be. And given how new the language is, they're incredibly complete. Jose et al made a great decision pretty early on in designing the language - they wanted to make documentation a first-class citizen.

Documentation is easily accessible from `iex`: `h Enum.map` prints:

<img src='/images/iex_doc_enum_map.png' class='default-width' />

HTML documentation [seems easy (enough) to generate](https://github.com/elixir-lang/ex_doc). Oh, and [doc tests](http://elixir-lang.org/docs/stable/ex_unit/ExUnit.DocTest.html) help cover the easy cases for your pure code.

**Now to beat Elixir up a tiny bit:** <small>(just a tiny bit, really\...)</small>

#### Referencing a Named Function Feels Too Clunky

Given the following module:

<script src="https://gist.github.com/jtrim/f9b837974d76e6fc6b26.js"></script>

If I wanted to use `thingy?` as a predicate when filtering a list, I'd have to do this:

```elixir
Enum.filter ["stuff", "thingy", "pancakes"], &Thing.thingy?/1
```

`&Thing.thingy?/1` is the syntax for capturing a named function, where one has to prefix the function reference with `&` and specify its arity by suffixing `/1` (or whatever the actual arity of the function is). Recently coming from Haskell, where I can do something like:

<script src="https://gist.github.com/jtrim/fde5fa4c9113010a5863.js"></script>

The whole `&stuff/arity` song-and-dance feels unnecessary, and it made me a little sad to write it. However, this was a pretty minor sad for me. It's a pretty small price to pay to be able to throw functions around in a functional style, and on the bright side, you never have to guess which definition of a multi-definition function is actually being invoked in this manner.

#### Possible API Inconsistencies?

This is another minor thing, but consistency is a quick trigger for me, so I have to include it. `String.split/2`'s signature and `Regex.split/2`'s signature have their arguments reversed, but they do basically the same thing (or more correctly, are commonly used to achieve the same end). Why the reversal?

This is the only occurrence I ran across when coding the Kata so I really can't say whether or not more can be found. Maybe there's a good reason for this, but I didn't see it through this (tiny) exercise.

---

Despite the tiny annoyances, I'm overjoyed with what I've seen so far. And this really feels like the tip of the iceberg. Since it runs on the Erlang VM (Beam), handling concurrency elegantly is front-and-center in the design of the language. If Elixir is anything like Erlang in this regard, sending messages to a process running on another machine should be handled relatively seamlessly. And like Erlang, Elixir's concurrency model is based on the use of lightweight processes, letting the underlying system handle some of the setup / teardown overhead involved in working concurrently. Another reason I'm excited about Elixir is [Phoenix](https://github.com/phoenixframework/phoenix), the web app framework that seems to have the most traction.

Elixir seems to have a lot going for it, and at 1.0 it's a pretty full-featured ecosystem, complete with a package manager  (Hex), build tool (Mix), and great documentation. I'm excited to go deeper, and I'll try and post my findings here. Happy coding!

<small id="footnote1">
**\*** This makes some amount of sense given it's largely a product of José Valim. If you consider yourself a part of the Ruby community, you've almost certainly heard his name at least in passing, but if not, he's [done a lot for Rails](https://github.com/rails/rails/graphs/contributors), [among other things](https://github.com/josevalim).
</small>

<small id="footnote2">
**\*\*** I thought about this a bit more after originally writing and publishing this post, and came to the conclusion that one actually _could_ compose functions in Ruby. [This post](http://blog.moertel.com/posts/2006-04-07-composing-functions-in-ruby.html) confirms the possibility, but it's not very practical. Still very cool though.
</small>
