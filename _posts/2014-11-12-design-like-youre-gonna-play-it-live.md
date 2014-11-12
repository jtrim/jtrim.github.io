---
layout: post
title:  Design Like You're Gonna Play It Live
permalink: design-link-youre-gonna-play-it-live
---

Have you ever listened to a song that sounds like it was recorded in one take? With all the musicians present in the same room when it was recorded? When I know about them, those are my favorite kinds of recordings. There's 'chemistry' in the music that you don't get out of the more patchwork quilt-style recordings - those where the hard solo is tracked after the rhythm section is done, complex haromonies are captured apart
from drum and bass, etc. I call music recorded in this way "airbrush music". It's perfect in every way. Tempo, articulation and synchronoziation are all right on the mark, but sometimes it's a little _too_ good.

In addition to production quality, you find musicians achieving things in the studio that just aren't possible live. For example, if you've got a band made up of a guitarist, a bassist, and a drummer, and you hear a solo overlaying rhythm guitars, you can expect one of two things live: there'll be a guest guitarist present or the song will omit one of the parts altogether.

#### How does this translate to design?

When designing for the web, it's easy to design like you're in a recording studio. You take some liberties - add some spice to what are usually native browser controls, fudge with the kerning to get things to line up - and what you end up with is a super-polished, very attractive design that is expensive and difficult (or impossible) to execute in a live scenario. <!--\-->I've found that this is the case most of the time when folks who come from an illustration or print design background, particularly in larger organizations where design and development are sizable, separate departments. Such designs can lead to a few unpleasant scenarios:

- The sci-fi design elements get dropped from the launch version
- The timeline gets bloated to accommodate the additional effort
- The codebase gets crufty to support an overly-imaginative design

As developers, these things are easy to spot when we're looking closely enough. But spotting it is only half(-ish) of the battle - what can we do about it? What _should_ we do about it?

#### Pairing: not just for code

For a non-developer that wants (or needs) to understand what design components are feasible has a pretty steep hill to climb. Developers are notoriously bad at internalizing things, and UI feasibility is no exception. For example, we take for granted that our peers know things like custom select boxes _actually do_ add scope most of the time.

Before I dive in to this topic, one clarification - I'm not suggesting that every designer should learn how to code. I feel like thinking in terms of code alters the creative process for some, so I don't think it's fair to say "Only good designers code." However, at least in these terms, identifying a design
element that can be a digital red herring is mostly painted black and white. As such, this know-how can be pretty quick and easy to pass on.

When two developers pair on a problem, and especially when the two developers really mesh, it's very much an act of filling in each other's weaknesses and augmenting the other's strengths. I believe the same thing can happen across disciplines. The details are mostly outside the scope of this text, but [Anders
Ramsay explores this in detail here](http://www.andersramsay.com/2009/05/01/less-wireframes-more-collaboration-with-pair-design/). With cross-discipline pairing, a few advantages become clear pretty quickly:

- Design / concept rabbit holes essentially disappear
- Implementation pains becomes very real for the designer
- We developers get to contextually understand just _why_ X design  aspect of Y component is so important, and why it's worth the cost

You know what else happens? Feedback gets much easier to give and receive. _In general_, communication becomes easier, which is the whole reason this is even an issue in the first place - pairing is a way to break down walls across disciplines.

#### Something to keep in mind

Just like any pair, the better the two personalities mesh, the better the product of a pairing session. The worse they mesh, the easier it's going to be to blame it on the pairing process itself. This kind of failure will _definitely_ happen, and it'll be easy to blame it on the process, but don't. Try again. Maybe not necessarily with that same person, but keep an open mind.

Pairing isn't just for a dev/dev pair, nor is it just for a dev/design pair. Although the content of this article is focused on dev/design pairing, the specific relationship between the two isn't really the focus. Between two disciplines that share some overlap in concerns, more communication, and even more than that, better understanding, is what pairing is really great at enabling.
