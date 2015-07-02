---
title: 'Instance Variables vs Private Readers'
layout: post
permalink: '/ivars-vs-private-readers/'
---

I like to be decisive about why I do certain things in the code that I write, but there are always fences to be sat upon. One fence I've been sitting on for a couple of years has to do with whether or not a class should have access to its own data, or if it should run through a reader method first. I think there are good arguments either way, but where I finally landed has to do with when doing so is an early optimization, and when it makes sense to commit to.

### Why Private Reader Methods Make Sense

Most of the classes I write these days tend to be pretty small. They accept few constructor arguments and tend to expose one or two public methods. Though in any non-trivial application, there are eventually going to be places where one needs to coordinate a bunch of these small objects to work together to do a laundry list of things related to some high-level action. Inside these coordinating entities, the use of private reader methods starts to make sense. If you start these classes out using private readers to access data, it gives you more flexibility when you decide something needs to be delegated instead of accessed directly.

```ruby
class Actions::SignUpUser
  def initialize(invitation, invited_group, user_params)
    @invitation = invitation
    @user = invitation.invited_user
    @invited_group = invited_group
  end

  def perform
    if @user.save
      email_user(@user)
    end
  end
end
```

Our coordinating entity knows about the services provided by a few different objects - A, B, and C. However, Object A also knows about the X property of object B. In this case, it's unnecessary for both our coordinating entity and Object A to depend on B#X, so we could refactor thusly:

```ruby
# TODO: example
```

Now we're delegating access to B#X through object A. Imagine if we hadn't made this refactoring, and B#X changed to B#get_X. Instead of having to find/replace the API change, we only need to change it on one place.

### Why Private Readers Don't Make Sense

If we were to apply the use of private readers dogmatically, our smaller objects A, B, and C could make use of them as well:

```ruby
# TODO: example
```

...but in a well-factored state, these smaller objects don't really do a lot of coordination. Rather, the code is usually pretty focused on doing as few distinct jobs as possible. Most of the time, for these smaller objects, giving the class access to their own data lightens the load of parsing the class to find out what's going on (and simply leads to fewer lines):

```ruby
# TODO: example
```

### Don't Be Dogmatic

As with most things in programming, there's no right or wrong answer that can be applied to every instance of a given problem, and this issue is no exception. If you have thoughts on the issue of using private readers vs not, I'm interested to hear them - hit me up on Ello at @trmbl or Twitter at @jessetrimble.