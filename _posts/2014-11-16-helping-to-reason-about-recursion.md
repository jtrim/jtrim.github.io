---
layout: post
permalink: helping-to-reason-about-recursion
---

Recursion can be a scary topic. On the surface, it requires you to keep more of a mental stack trace around to try and understand what a recursive function is doing. For example, what is the state of the function input on iteration one? Then on iteration two? What about iteration 8311?

In reality, most of the time we don't even really have to care about this mental stack trace. It is actually way simpler than that. <!--\-->Let's take a simple function that reverses a list (in Ruby):

```ruby
def list_reverse(list)
  return list if list.empty?
  [list.pop] + list_reverse(list)
end
```

Looks pretty simple, right? Let's look at what this function actually does:

1. We pop the last item off the list
2. We wrap the newly-popped item in an array
3. We add it to the result of reversing the _rest_ of the supplied list
4. As a guard, we make sure we don't try and continue reversing a list that doesn't have any more items

\#1 and #2 aren't unusual, and as a statement, #4 is dead simple. #3, however, is where the cognitive overhead starts to stack up, because we have to reason about what happens when we call `list_reverse` from within `list_reverse`.

Let's take a moment and think about the problem differently. What are the inputs our method needs to be able to handle? Let's look back at #1 from above:

```ruby
list.pop
```

Okay, so it's a list. What are the possible return values of calling `pop` on a list? We're either going to get a non-nil item from the receiving list, or `nil` if the list is empty[\*](#footnote1). The `nil` case seems like a good thing to focus on, because that's the point when we can no longer recurse. What does that mean?

When we can no longer recurse, then we have to return something that the statement which initiates the recursion can consume. Looking at #2 from above, we're wrapping an item from the list in an array, then concatenating it with the return value from `list_reverse`. There's our answer, we need an array!

That's were #4 from above comes in - this is our terminus, the end of the line. Once we return an empty list, then as the execution frame bubbles back up the stack[\*\*](#footnote2), all of the items we've popped from the list will be concatenated, in reverse order, into a new list, which is returned in the end.

So it seems, based on our analysis, that when reasoning about recursion, we need to consider:

1. What is the initial input of the function?
2. What does the terminus of the recursion look like?

\#1 is easy, because we know what we're giving our recursive function to begin with. #2 is a bit more difficult, especially if we're thinking about a function that hasn't been written yet. But understanding the nature of the terminus has a lot to do with the type of the input. Do we pass our recursive function a list? Then that function's terminus should be an empty list. What about a hierarchical tree? If we're starting at the bottom of the tree, then the terminus would be a node that doesn't have any more children. In reverse, the terminus would be a node that doesn't have a parent.

In functional programming, many times we don't have a 'for' loop to get work done, so recursion slides in as our go-to when we need do work against a bunch of similar things. Sometimes there are downsides to using recursion in some languages that aren't optimized for it - running the stack too deep is a big one. However, when your language runtime doesn't get in the way, recursion can be a great alternative to the kinds of iteration one typically finds in an imperative language, and it causes you to think differently about problems as a whole.

<small id="footnote1">
**\*** For the sake of easy argument, this assumes the list doesn't actually contain `nil` as an item of the list. As it turns out, it doesn't matter because in our implementation, we're checking `list.empty?` to find the terminus.
</small>

<small id="footnote2">
**\*\*** In Ruby, it bubbles back up the stack because Ruby is not tail-call optimized. In languages that are, recursion doesn't consume frames on the call stack as long as the recursive statement is the last in the function. Worth noting - the Ruby Language spec doesn't require tail-call optimization, [but apparently some VMs support it](http://stackoverflow.com/questions/824562/does-ruby-perform-tail-call-optimization).
</small>