---
title: 'Antipatterns: Subclassing Struct Instances in Ruby'
layout: post
permalink: '/antipatterns-subclassing-struct-ruby/'
excerpt: >
  Using plain Ruby objects to encompass specific domain concepts is a great way to address model bloat in Rails applications. I recently worked on a medium-sized Rails application that made effective use of this notion, but did it through subclassing instances of Ruby's Struct class. This makes for nicely succinct code, but introduces some insidious problems that are likely to creep up later.
---

Using POROs (plain old Ruby objects) to encompass specific domain concepts is a great way to address model bloat in Rails applications. I recently worked on a medium-sized Rails application that made effective use of this notion, but did it through subclassing instances of Ruby's `Struct` class. <!--\-->Here's a contrived example illustrating the activation of a user:

<script src="https://gist.github.com/jtrim/1e965728892b79de2de7.js"></script>

This is nice and succinct, and visually much cleaner than defining a PORO that essentially does the same thing, but there are a couple of drawbacks in this approach that can have some profound effects on large or long-lived applications.

### Public APIs

One thing `Struct.new` does for you is provide you with accessors for any properties you specify in its constructor. In our above example, we can do:

```ruby
activation = Activation.new(user, "ABCDEF")
activation.user #=> User instance
activation.activation_token #=> "ABCDEF"
```

The problem is that we probably don't always want to expose those things as public APIs, especially in domain objects, which tend to be all about *behavior*. Let's hide away our `user` and `activation_token` readers from the outside world:

<script src="https://gist.github.com/jtrim/be61023e1ad91050ba63.js"></script>

...or better yet, ditch the readers and let the class have access to its own data:

<script src="https://gist.github.com/jtrim/f4a430e619596e92535a.js"></script>

Moving away from a `Struct.new` subclass means we've gone from exposing 5 public API methods (remembering that each accessor counts for 2, a getter and a setter) to only exposing 1, `activate`, which represents the sole responsibility of this object - to activate a user. In general, one should always strive to keep the public API as small as possible without sacrificing the usability of the interface. This includes not exposing data unnecessarily.

### All Constructor Arguments Are Optional

`Struct.new` sets up the constructor of its subclasses to allow all of its constructor arguments to be optional. With the `Struct.new` version of our `Activation` class above, we could also do:

```ruby
activation = Activation.new
activation.user = user
activation.token = "ABCDEF"
```

...or we could do:

```ruby
activation = Activation.new(user)
activation.token = "ABCDEF"
```

In the absence of a specific reason for allowing either of these forms, we should always strive to be as specific as possible with regard to how an object is to be used. In considering that each API we expose to the public is essentially a contract of a service the object provides (and how the service is provided, i.e. the usage of the API), we're putting ourselves in a situation where we have to maintain an increased amount of complexity in our API, and it puts us at greater risk of issuing an otherwise inconsequential change that breaks our API later (a major version bump in [Semver](http://semver.org/).

### Then What the Heck Is `Struct` For?

Generally speaking, a struct is just a record. That is, a struct just a unit of related data properties. They encapsulate data and don't provide any behavior apart from getters and setters. In Ruby, it just so happens that it's really easy for us to tack on behavior to `Struct` instances, which is why I think this pattern emerged in the first place.

I don't often make use of structs for data in Ruby applications, but one could imagine a scenario where a representation of some aggregate data would be useful in a calculation, perhaps from consuming a data file and aggregating the data in some intermediate calculation that is persisted afterward.

---

Here's a PORO implementation of our `Activation` class from above:

<script src="https://gist.github.com/jtrim/dd6c5141ab5e89a386ad.js"></script>

With this implementation, there's only one way to initialize an `Activation` with a user and a token, and it has only one other method to call. It's pretty clear that, although somewhat contrived, this object has only one responsibility, and its usage is clear from an API perspective. Yeah, sure...it's not as pretty - we've got more boilerplate wrapped up in `initialize` - but sacrificing an API for the sake of code vanity isn't a good trade in the long run.

What this really boils down to is being intentional about the code we write.[\*](#footnote1) I'm not saying *"Don't subclass Struct.new **EVER**,"* just be aware of the drawbacks. If you're prototyping or writing your grocery list app that runs on an iPad taped to the side of your fridge, then knock yourself out. But when building systems of any size or life expectancy, API bloat is an insidious problem where the full pain often times isn't felt until much later. Be nice to your future-selves and successors, and stop subclassing `Struct.new`.

<small id="footnote1">
**\*** While I'm mostly interested in the API implications in this article, there are other reasons why subclassing `Struct.new` can be a bummer. You can read more about it [here](http://www.reddit.com/r/ruby/comments/14u7zs/dont_subclass_struct_classes_please/).
</small>
