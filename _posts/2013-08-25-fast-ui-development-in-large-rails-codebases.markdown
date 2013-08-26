---
layout: post
title:  Fast UI Development in Large Rails Codebases
categories: development
tags: rails unicorn
permalink: fast-ui-development-rails.html
content_as_excerpt: true
---

I've spent the past year working on a product running on a relatively large
Rails codebase, spending about half my time on the back-end and half in the UI
layer. As the codebase has grown in size on the back-end, I've noticed an
increasingly prevalent source of frustration in my day-to-day: slow request
times when writing code for the UI.

#### But slow Rails should be a thing of the past. What's up?

With this particular codebase, we're using [Require.js](http://requirejs.org/)
for a large part of our JS functionality. In production, the associated scripts
are being compiled into a single file via R.js, but in development, Require.js
will make a request for each script in your `require` directive. Unless you're
running Rails behind Apache or Nginx (or some other reverse-proxy), Rails is
being asked to serve all asset requests the browser issues, including assets.
In our case, without completely realizing it ended up asking Rails for *a lot*
of stuff. Based on this, it would stand to reason that if we're asking too much
of a single Rails process, adding processes might help the problem, right?

#### Unicorn: Let's Add Some Concurrency

By starting a single master process that proxies requests through to one or
more worker processes, [Unicorn](https://github.com/blog/517-unicorn) can split
the work up for you relatively seamlessly. Essentially, as the browser is
issuing requests, the master process is delegating the fulfillment of each
request to a different process. That means that if you've specified that the
Unicorn master process should start three worker processes, each of those
processes should handle roughly a third of the requests the master receives.\*

<small>
\* In reality it doesn't actually work out to be a third because of varying
amounts of work being done per-request. I've simplified for the sake of
discussion.
</small>

After adding Unicorn and scaling up the number of worker processes, I expected
to see a significant decrease in request times. What I found was disappointing
- there wasn't really any difference to speak of. I didn't measure any
benchmarks at the time but I *did* have an idea: I knew that Rails handles
class loading and caching differently in development than in production, so
I started playing around with some of Rails' configuration.

#### The Solution

A default Rails development configuration
(`config/environments/development.rb`) has a couple of configuration lines, one
of which is:

{% highlight ruby %}
config.cache_classes = false
{% endhighlight %}

This configuration is the part that allows us to change some of our application
code and see those changes reflected the next time we hit the server. This is
because Rails will reload the code in its `autoload` paths everytime a request
is received. In my case, our large codebase meant the reloading of *lots* of
files. After setting this to `true`, the speed gains were astounding - this one
configuration change made the app feel nearly as snappy locally as it did in
production.

With the application server responding much faster, there was one more line in
the configuration that stood out:

{% highlight ruby %}
config.assets.debug = true
{% endhighlight %}

When assets from the Asset Pipeline, this configuration essentially expands all
of our `//= require ...` directives into actual server requests. While this
helps in tracking bugs down to an individual file, it's really not always
necessary. Even though a large portion of the codebase used Require.js in stead
`//= require ...` directives, we still had a non-insignificant number of files
that did. Flipping the switch on this configuration reduced the number of HTTP
requests going out to our server on each page load, which added to our
performance gains from the previous config change.

#### One Problem - What If I *Need* Code Reloading?

In my example, this was great if the UI structure was already built out and
I was *just* working on JS / CSS code, but this happened frequently enough to
render this solution insufficient. Restarting a server every time application
code or views were modified was just too slow in process. However, I decided to
take one more dive into the Unicorn docs just for kicks, and I found something.

Unicorn was built on strong principles lying in the foundation of Unix (see [I
like Unicorn because it's Unix](http://tomayko.com/writings/unicorn-is-unix) by
Ryan Tomayko, good read). As such, it's capable of receiving and reacting to [various
signals](http://unicorn.bogomips.org/SIGNALS.html). More specifically, Unicorn
reacts to receiving a SIGHUP by reloading its configuration file and restarting
all of its workers. Sending a signal to the process for code reloading is only
mildly faster in-process, the gains weren't enough to justify doing this
manually. However, there are lots of utilities out there that will watch a file
system node and execute some code on change. My current favorite is
[rerun](http://rubygems.org/gems/rerun) because of its simplicity. Using Rerun
is what makes this all come together.

When you start a Unicorn server, you'll see output that looks something like
this:

<pre>
started with pid 25747
[2013-08-25T20:14:38.044546 #25747]  INFO -- : Refreshing Gem list
[2013-08-25T20:14:45.094800 #25747]  INFO -- : listening on addr=0.0.0.0:3000 fd=12
[2013-08-25T20:14:45.099519 #25747]  INFO -- : master process ready
[2013-08-25T20:14:45.135473 #25751]  INFO -- : worker=1 ready
[2013-08-25T20:14:45.135675 #25750]  INFO -- : worker=0 ready
[2013-08-25T20:14:45.141830 #25752]  INFO -- : worker=2 ready
</pre>

Since we know the PID, we can send a signal to it via:

<pre>
kill -1 25757
</pre>

Running this manually gets us our code reload, so to bring Rerun into the mix,
all we need is:

<pre>
rerun -- kill -1 25757
</pre>

With a little Rerun tuning, you can restrict the types of files it watches to
a path pattern, making it ignore anything in `app/assets` and watch for changes
in application code.
