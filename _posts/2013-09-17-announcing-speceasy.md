---
title: Announcing SpecEasy
layout: post
---

*As an employee of [TrackAbout][], I have been helping to develop SpecEasy and prepare it for public release. A version of this announcement was originally posted September 17 on the [TrackAbout Blog][].*

TrackAbout is proud to release version 1.0 of [SpecEasy][], our open-source unit testing framework for the .NET platform. SpecEasy features a simple, fluent language for writing [BDD][] style tests. Though it’s lightweight and has few dependencies, it includes powerful features such as nested contexts, expressive test results, and auto-mocking.

## An example

Here is an example of SpecEasy in action:

{% highlight csharp %}
public void FizzBuzzDo()
{
    string result = string.Empty;
    int input = 0;

    When("running FizzBuzz", () => result = SUT.Do(input));

    Given("an input of 1", () => input = 1).Verify(() =>
        Then("it should return a stringified 1",
            () => Assert.That(result, Is.EqualTo("1"))));
}
{% endhighlight %}

If the test passes, the result looks like this:

    ------------ FULL RESULTS ------------
    given an input of 1
    when running FizzBuzz
    it should return a stringified 1

    1 passed, 0 failed, 0 skipped

## Origins

SpecEasy was the result of [efforts][Rock] by two of TrackAbout’s developers to overcome barriers to practicing effective [test-driven development][TDD]. Even after reducing build times, our existing unit test framework choices (basic NUnit and an in-house variant of [SpecsFor][]) were either not sufficiently expressive or too verbose and formal to achieve a fast red/green/refactor cycle. The [NSpec][] BDD framework looked promising, but would have required introducing a new test runner to the TrackAbout environment; NUnit was already well established at the company with thousands of unit and integration tests.

Thus was born a unit testing tool that eventually became the SpecEasy framework. Using [self-directed developer time][devtime], TrackAbout developers helped to contribute refinements and bring it into the open source community. We used a [Trello][] board to track our progress and collaborate on planning and ideas. Some of our newest developers are getting involved in the project as we start to tackle post–1.0 enhancements.

## Core goals and values

### Terse, readable, maintainable tests

The syntax of SpecEasy tests encourages you to simplify complicated setup code or move it out of the way. The resulting compact set of natural language spec descriptions can be easier to read and maintain by others.

### Facilitate TDD

SpecEasy can encourage good unit testing discipline. Nested contexts without the ceremony of class hierarchies makes it easy to iteratively construct specs and data for progressively more complex test scenarios. Simple, terse syntax reduces keystrokes, keeping the red/green/refactor rhythm going. The auto-mocking feature can greatly reduce boilerplate code for setting up dependencies and stubs, lowering the barrier to testing more complex classes.

### Facilitate BDD

The *Given/When/Then* structure of SpecEasy tests mirror the specification language of behavior-driven development. The specs themselves get the spotlight: they are written first, in natural language, at the beginning of the line, made prominent by your editor’s syntax highlighter:

![Syntax highlighting example][syntax]

### Lightweight

SpecEasy is designed with few dependencies. We want this to be easy to plug into any environment.

## Sounds great. How do I get started?

SpecEasy is currently designed to run on top of the widely supported NUnit test runner. If you use NUnit in Visual Studio or on the command line, using SpecEasy is as simple as adding it to your project via the [NuGet package manager][NuGet], and subclassing `SpecEasy.Spec`.

Check out our readme on [GitHub][SpecEasy] for a more detailed overview and tutorial, and the [SpecEasy.Specs][] test classes for more examples. Better yet, fork our repository and send us a pull request. We’re looking forward to your comments and contributions.

[SpecEasy]: https://github.com/trackabout/speceasy
[Rock]: http://thoughts.rockhymas.com/post/46502436466/introducing-speceasy
[BDD]: https://en.wikipedia.org/wiki/Behavior-driven_development
[TDD]: https://en.wikipedia.org/wiki/Test-driven_development
[SpecsFor]: http://specsfor.com
[NSpec]: http://nspec.org
[NuGet]: https://www.nuget.org/packages/SpecEasy/
[devtime]: http://blog.trackabout.com/2012/10/17/self-directed-developer-time/
[Trello]: https://trello.com
[syntax]: http://i2.wp.com/blog.trackabout.com/wp-content/uploads/2013/09/speceasy-syntax.png
[logo]: https://raw.github.com/trackabout/speceasy/master/speceasy_logo_sq_128.png
[TrackAbout Blog]: http://blog.trackabout.com/2013/09/17/announcing-speceasy/
[TrackAbout]: http://corp.trackabout.com
[SpecEasy.Specs]: https://github.com/trackabout/speceasy/tree/master/SpecEasy.Specs
