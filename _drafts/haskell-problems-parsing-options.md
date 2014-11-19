---
layout: post
permalink: haskell-problems-parsing-cli-options
title: "Haskell Problems: Parsing Command Line Options"
---

[Littlenote](https://github.com/jtrim/Littlenote) is a bash script I started a few years ago for capturing quick notes with an attached timestamp. I've been meaning to rewrite it for some time now, but it hasn't ever really been a priority. Since I started looking at Haskell again, however, it seems like a great exercise to get to know some of the base parts of the language and standard library a little better.

One of the things I have to do with Littlenote is parse command line options supplied by the user. Prelude provides [System.Console.GetOpt](http://hackage.haskell.org/package/base-4.7.0.1/docs/System-Console-GetOpt.html) for this (which, according to *hackage*, is a port of the GNU `getopt` library), but I decided to go ahead and implement a CLI options parser of my own just for the experience of having done so. This post is a review of where I ended up with the part of the option parsing that takes a `String` list of options and returns some structured data that Littlenote can determine user intent from (`:: [String] -> [Argument]`).

#### `Argument` Data Type

In writing this, I quickly arrived at the idea of needing a data type to represent the idea of a single command line option. There are currently three types of options Littlenote handles - boolean arguments, option arguments, and value arguments. Here is our `Argument` data type definition:

```haskell
-- Argument.hs
module Argument (Argument(..)) where

  data Argument = BooleanArgument String        -- e.g. --force
                | OptionArgument  String String -- e.g. -n 10
                | ValueArgument   String        -- e.g. the `stash` in `git stash`
                deriving (Show)
```

The important parts of this are:[*](#footnote1)

```haskell
data Argument = ...
```
This defines our data type. Any type constructor after this are considered types of `Argument`s.

```haskell
  BooleanArgument String
| OptionArgument  String String
| ValueArgument   String
```

These are the value constructors of our three types of arguments. Through these, we can say things like `BooleanArgument "--force"` to create an argument. Data types in Haskell don't carry any behavior with them outside of the value constructors, so this is it for our `Argument` definition.

#### Interpreting Options

The next important part is implementing the type signature above: `:: [String] -> [Argument]`, or, more verbosely, "when given an array of `String`s, return an array of `Argument`s".

Here's my implementation:

```haskell
-- ArgumentParsing.hs
module ArgumentParsing (argumentPairs) where
  import Data.Maybe
  import Data.List
  import Argument

  argumentPairs :: [String] -> [Argument]
  argumentPairs [] = []
  argumentPairs (arg:nextArg:args)
    | isArgumentTerminator arg = []
    | otherwise =
      case buildArgumentPair (Just arg) (Just nextArg) of
        constructed@(BooleanArgument _)  -> constructed:argumentPairs (nextArg:args)
        constructed@(ValueArgument _)    -> constructed:argumentPairs (nextArg:args)
        constructed@(OptionArgument _ _) -> constructed:argumentPairs args
  argumentPairs (arg:args) = buildArgumentPair (Just arg) Nothing:argumentPairs args

  buildArgumentPair :: Maybe String -> Maybe String -> Argument
  buildArgumentPair (Just current) Nothing
    | isDashy current = BooleanArgument current
    | otherwise       = ValueArgument current
  buildArgumentPair (Just current) (Just next)
    | isDashy current = if isDashy next
                        then BooleanArgument current
                        else OptionArgument  current next
    | otherwise       = ValueArgument current

  isArgumentTerminator = (==) "--"
  isDashy              = isPrefixOf "-"
```

The `argumentPairs` function is the core functionality this module provides, but let's talk about the more peripheral functions first:

```haskell
isArgumentTerminator = (==) "--"
isDashy              = isPrefixOf "-"
```

We could actually read the definitions of these functions as:

```haskell
isArgumentTerminator s = "--" == s
isDashy              s = isPrefixOf "-" s
```

\...but since every function in Haskell is curried[**](#footnote2), we can omit the `s` argument altogether.

Next, we start to get a little more involved with `buildArgumentPair`:

```haskell
buildArgumentPair :: Maybe String -> Maybe String -> Argument
buildArgumentPair (Just current) Nothing
  | isDashy current = BooleanArgument current
  | otherwise       = ValueArgument current
buildArgumentPair (Just current) (Just next)
  | isDashy current = if isDashy next
                      then BooleanArgument current
                      else OptionArgument  current next
  | otherwise       = ValueArgument current
```

This function essentially accepts two strings and builds an Argument of the appropriate type, and is able to handle missing values through Haskell's `Maybe` type[***](#footnote3).

Let's start with the first definition:

```haskell
buildArgumentPair (Just current) Nothing
  | isDashy current = BooleanArgument current
  | otherwise       = ValueArgument current
```

This definition handles the case where we only supply one of the two possible argument values. We have two argument types that take only one value in its type constructor, `BooleanArgument` and `ValueArgument`. Our logic here says "if the first value starts with one or more dashes, it's a boolean argument. Otherwise, it has to be a value argument." We're handling the case where we can supply both values in our second definition:

```haskell
buildArgumentPair (Just current) (Just next)
  | isDashy current = if isDashy next
                      then BooleanArgument current
                      else OptionArgument  current next
  | otherwise       = ValueArgument current
```

This function operates against a pair of possible argument values - the first being the name of the argument and the second being an optional argument value. One important assumption we're making in the implementation here is that if two consecutive values both start with dashes, the first is a boolean argument, which is what we're saying inside the `then` expression of our first guard. If we make it to the `else` expression, we know we've got something like `-n 10`, so wrap up an `OptionArgument`. The `otherwise` guard covers the case where the first supplied value is without dashes - what we're calling a `ValueArgument`. This covers extracting meaningful arguments from a possible argument pair, but this _does not_ do anything with a list of arguments, which is how we arrive at our `argumentPairs` implementation.

`argumentPairs` receives a list of all whitespace-separated values the user has supplied us from the command line. This is where we try and make some meaning out of it all:

```haskell
argumentPairs :: [String] -> [Argument]
argumentPairs [] = []
argumentPairs (arg:nextArg:args)
  | isArgumentTerminator arg = []
  | otherwise =
    case buildArgumentPair (Just arg) (Just nextArg) of
      constructed@(BooleanArgument _)  -> constructed:argumentPairs (nextArg:args)
      constructed@(ValueArgument _)    -> constructed:argumentPairs (nextArg:args)
      constructed@(OptionArgument _ _) -> constructed:argumentPairs args
argumentPairs (arg:args) = buildArgumentPair (Just arg) Nothing:argumentPairs args
```

<small id="footnote1">
**\*** If you're interested in what the rest of the parts of this example (or any others) are, [Learn You A Haskell](http://learnyouahaskell.com) is a fantastic resource.
</small>

<small id="footnote2">
**\*\*** Any Haskell function that takes multiple arguments is internally returning a series of functions that each take one argument and return a function that accepts the next argument (and so on). This means `map stepFn list` is actually being evaluated as `((map stepFn) list)`. In both `isArgumentTerminator` and `isDashy`, we're simply returning a partially applied function that accepts one argument - that being the string we're interested in testing. This is a slightly more involved explanation of how we're able to omit the argument in our function definition, but you can read more on Haskell's curried functions [here](http://learnyouahaskell.com/higher-order-functions#curried-functions).
</small>

<small id="footnote3">
**\*\*\*** A `Maybe` can either be Nothing or `Just a`, where `a` is an unspecified type. A familiar idiom in a more forgiving language like Ruby would be `def foo(bar); return nil if bar.baz?; bar.bif; end`, where we're able to return either `nil` or something else. Haskell requires a function to only return one type, so by wrapping a value in `Maybe`, we're able to be somewhat flexible with our 'something or nothing' function behavior.
</small>