---
title: Undocumented NSCalendar Methods
layout: post
show_modified_notice: true
---

While working on an iOS app, I found myself writing some NSCalendar extension methods such as `beginningOfDay(relativeToDate:)`, thinking that the NSCalendar class was a little lacking. Then I stumbled upon some undocumented NSCalendar methods that accomplish exactly what I was looking for.

These methods are not yet mentioned in the latest [iOS][NSCalendar-iOS] and [OS X][NSCalendar-OSX] documentation, though they were added to the frameworks as of iOS 8.0 and OS X 10.9. I found them when I command-clicked an another NSCalendar method to check on its signature, and noticed a lot of new convenience methods for constructing and enumerating dates. Check the [iOS 8 API diffs][diffs] to see everything that was added. Hopefully this will save someone some effort.

Before finding these new APIs, I had finished writing my own version of `startOfDayForDate` using TDD. I removed my own extension methods and updated the app to use the builtin methods, but I kept the unit tests that were already written since they function as some nice documentation. I published these unit tests as a [Gist][] in case they prove useful to others.

*Update:* [NSHipster][] published an in-depth article about all of the recent NSCalendar API additions.

[NSCalendar-iOS]: https://developer.apple.com/library/ios/documentation/Cocoa/Reference/Foundation/Classes/NSCalendar_Class/
[NSCalendar-OSX]: https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSCalendar_Class/
[diffs]: https://developer.apple.com/library/ios/releasenotes/General/iOS80APIDiffs/frameworks/Foundation.html
[Gist]: https://gist.github.com/mmertsock/59a7673df76bc31b14e4
[NSHipster]: http://nshipster.com/nscalendar-additions/
