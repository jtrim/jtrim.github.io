---
layout: post
permalink: "/on-the-popularity-of-haskell/"
title: "On the (Un)Popularity of Haskell"
---

It's been about a month since I started trying to learn Haskell in earnest, and as a novice, there's something I'm finding about Haskell that wasn't apparent to me at the start. It's about the perception of Haskell and the primary sources of information about Haskell, and I think it has a lot to do with Haskell's apparent struggle to gain wide-spread adoption. **Haskell _actually is_ for everyone. The problem is _nobody knows it yet[\*](#footnote1)._**

When I first started learning Haskell, the language was intimidating. I hadn't worked with a statically typed language since my .NET days, and I became spoiled by how forgiving Ruby can be. As a career-long programmer in imperative languages, operating in a functional programming (especially in a pure functional language like Haskell) can be challenging. And Haskell is one of the more terse functional languages around, so the code density took some getting used to. But for those with persistence, these are small barriers that can be chipped away at slowly. Once I started to get my sea legs, I actually became quite comfortable, and Haskell, to some degree, lost that initial intimidation factor. I've worked with languages that 

### What Language Did You Learn First?

To explore this idea, let's go back to the first programming language you learned. I'm not necessarily talking about the language you were first exposed to. Commodore BASIC was the first language I wrote a running program in. I copied it from a book and ran it, and upon mashing my 9-year-old finger on the `RETURN` key, a cute little 8-bit song played from the tiny antique black-and-white TV my parents gave me to tinker with. I wrote a working program, but I sure didn't have the first idea about what any of the code was _actually_ doing.

Years later, the first time I felt like I understood what was really happening with the code I wrote - to whatever degree a new programmer can - was when I began learning Javascript. Most of my college programming curriculum had to do with VB.net and C#.NET, but I'm not sure I really "got" programming until Javascript. I'd imagine many programmers specializing in web technology have had a similar experience.

One reason it finally clicked for me was accessibility - it's really really easy to get results with Javascript. It takes a tiny amount of code to make pixels move on a screen, so the cost of experimentation is very low. I didn't have to know anything about what a "function" actually is, nor did I need an understanding of the nuances of prototypal inheritance or Javascript's unique (problematic?) scoping; rather, I was able to get results fast and learn the more complicated parts of Javascript the hard way.

### Of High Hurdles and Tar Pits

In my month of Haskell immersion, I've felt like that "move fast, learn the hard way" mentality has been altogether absent from the books and articles I've been reading. Perhaps that has something to do with the heavily academic interests stereotypically found in passionate Haskell developers, but the result is feeling like one needs to learn everything from how to use pattern matching, to [what Monads are](https://www.haskell.org/haskellwiki/Monad_tutorials_timeline) to do anything useful in Haskell. The perceived investment is very high for a new Haskell programmer - especially so for one who has had gained a deep understanding of another programming language.

For those of us who have been coding for awhile, we already have a pretty good idea of how to get things done in our strongest language. We know the frameworks and idioms well, and we've developed a strong intuition that tickles the base of our skull when we see code gone awry. For me, since Haskell _(pure-functional, compiled, statically typed)_ is so different from Ruby _(imperative, interpreted, strongly/dynamically typed)_, it feels especially foreign. I've got a brain-castle of programming know-how derived from my experience of Ruby, and I have to climb almost completely down from it to start building a new brain-castle in Haskell[\*\*](#footnote2). One of the biggest challenges for me has been to embrace the not-knowing part and understand that I don't have to have all the answers right now. Unfortunately, there aren't a whole lot of resources out there that support that way of thinking.

---

I think the barrier to entry into Haskell programming doesn't have to be so high. Like most programming languages, you don't have to fully understand every corner of the language (and let's be honest, Haskell has _a lot_ of corners...) to get real work done. Your future self will hate your past self for not knowing how to use Functors to achieve a higher plane of elegance, but how is that fundamentally any different than \<INSERT LANGUAGE HERE\>?

There's a huge space for so-called "beginner" tutorials in Haskell, and I think that can only do good things for the Haskell community. If we're permitted to view the evolution of Ruby as any kind of success story of a language, we see that Ruby's wide-spread adoption has lead to a hyper-rich ecosystem of plugins, utilities, frameworks, and libraries, and the "build / release / improve" mentality in the Ruby open-source community is incredibly healthy.

Haskell is an incredibly powerful language, and every day I use it for something I'm deeply impressed by its elegance and potential. The last time I felt like this about a language, it was Ruby. Not VB, not C#, not Java, definitely not Javascript, not Objective-C, not Python. While all those 'not' languages are surrounded by varying degrees of richness in the community, Ruby stands well apart. I think Haskell has what it takes to be beloved in the same way by a similar community of developers, and while this seems to gotten better in recent years, the barrier to entry is still too high, but contrary to how it might seem, it certainly doesn't have to be.

<small id="footnote1">
**\*** Forgive the tasteless use of hyperbole, but the unfortunate observation I've made is that some programmers _actually do_ know it's for everyone. Unfortunately for everyone else, those programmers tend to be veterans; thus, having internalized a lot of what makes Haskell intimidating, most unknowingly write tutorials for their peers, and not for those of us without the slightest clue.
</small>

<small id="footnote2">
**\*\*** This is actually one of the reasons I keep coming back to Haskell. The feeling of building this foundational knowledge is part of why I gravitated to programming in the first place, and while it's stressful to not be able to use a lot of what I already know about imperative programming, it's incredibly satisfying to figure these things out in Haskell and draw parallels to imperative style.
</small>