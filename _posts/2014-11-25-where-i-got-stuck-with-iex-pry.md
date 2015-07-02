---
layout: post
title: "Where I Got Stuck Using IEx.pry in Elixir"
permalink: iex-pry-elixir
---

Today I started messing with [Phoenix](https://github.com/phoenixframework/phoenix) - a web framework for Elixir - and got to a point where I wanted to inspect the environment around which a chunk of code was running in an EEx template, but ran into a bit of a wall. Following the example in the documentation for `IEx.pry`, my controller read thusly:<!--\-->

<script src="https://gist.github.com/jtrim/c696111c22b84a2d4800.js"></script>

I started my server via `$ mix phoenix.start`, and with the '/posts' route connected properly in my Phoenix router, I initiated a request. This showed up in my Phoenix log:

```text
Cannot pry #PID<0.259.0> at web/controllers/posts_controller.ex:8. Is an IEx shell running?
```

Well...yeah, an IEx shell was actually running at the time, in a different process. Given the by-default distributed nature of Elixir, I _assumed_ that calling `IEx.pry` from the Phoenix process would grab a running IEx process and ask to take it over. My assumption was reinforced by a quick and sloppy scan through [`IEx.pry`](https://github.com/elixir-lang/elixir/blob/v1.0.2/lib/iex/lib/iex.ex#L422) and [`IEx.Server`](https://github.com/elixir-lang/elixir/blob/v1.0.2/lib/iex/lib/iex/server.ex). After many minutes of confusedly poking at `iex`, I discovered, almost by accident, that the Phoenix process must run _within_ an IEx session[*](#footnote1):

```sh
$ iex -S mix phoenix.start
```

With this process spun up and an idle IEx prompt waiting, I issued a request and saw this in my terminal:

```text
Request to pry #PID<0.266.0> at web/controllers/posts_controller.ex:9. Allow? [Yn]
```

Keying `y<enter>` gets me what I expect - an interactive session in the context of my controller request.

Being brand-new at Elixir (and _definitely_ Phoenix), needing to run my Phoenix process through IEx wasn't obvious. I spent quite awhile trying to track this down through Googling everything and anything that seemed relevant and didn't really find anything that pointed me in the right direction, so I decided to post this here in case it helps someone down the road. Based on this experience, the pattern of `iex -S mix <DO_SOMETHING>` seems important to keep front-of-mind.

---

<small id="footnote1">
**\*** After briefly reading through the `IEx.Server` source again, I'm not convinced that the original behavior I expected isn't possible, it just appears `IEx.pry` doesn't support it. I'll follow up here if I later discover that it is.
</small>

<small id="footnote2">
**Update** - Thanks to [@kdisneur](https://twitter.com/kdisneur), [@fishcakez](https://github.com/fishcakez), and [@josevalim](https://twitter.com/josevalim), a version of remote `IEx.pry` has landed in Elixir! See [https://github.com/elixir-lang/elixir/issues/3392](https://github.com/elixir-lang/elixir/issues/3392).
</small>
