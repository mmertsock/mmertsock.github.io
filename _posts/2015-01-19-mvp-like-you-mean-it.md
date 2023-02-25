---
title: MVP Like You Mean It
layout: post
---

[Minimum viable product][mvp-def] (MVP) is often used in agile development to describe the first major milestone of new software projects. Both at my day job and in my personal projects, we try our best to realize this ideal of shipping a usable product to key stakeholders as soon as possible. But how often do we *really* accomplish this?

MVP can be a challenge to realize with any type of project. At one end of the spectrum, it is tough to find a reasonably small set of core functionality in an enterprise focused application: there are entrenched, complex workflows and business rules to replicate, multiple customers with disparate use cases, and the final vision can be intimidating in its scale. At the other end of the spectrum, when I work alone on some idea for a tool or app, the creative blank slate and lack of external constraints and deadlines can make it hard to find a clear direction and get initial traction: I need to construct everything from scratch, including a vision, market, and audience.

Usually, we do arrive at something that can be called an MVP, but I think it typically takes longer to get there than we would want. There is the feeling, in retrospect, that there existed some other set of choices that would have produced a minimum viable product more quickly, with less cost and complexity.

This past week, however, I found my way to MVP with a personal project in about eight hours of work. Throw an icon on it and it really could be shipped and used by actual users. It works, it has a basically production-ready database, it handles all the major edge cases and logic needed to function reliably for everyday usage, and it doesn’t look terrible.

How did I achieve this? I found one core use case that covers 90% of the time a user will interact with the application, and focused solely on what was essential for the user to efficiently complete this task. I created a “sprint” on my [Trello][] board and give it a title based on this use case. Then I dove right into the implementation and the code was flowing quickly and confidently.

The key was that every detail of what I needed to do could fit in my head because the goal was simple and focused. Every unrelated idea was filed as a Trello card and evicted from my mind. I skipped unit tests for views and controllers because at this point the UI was simple to test manually, and it would be highly subject to change after the MVP. For the core business logic, however, I used TDD, as it was clear that getting this right would be vital to the foundation of the entire app. The tests drove the design of the code and kept me focused on the actual user stories. I started using the application myself, for a real-world need, on day one.

So, every time you start a new project, take the time to really search for that MVP. It is hiding somewhere in the growing list of ideas, a magical incantation of the right user stories.

A good MVP requires focus. It requires [saying no][], or at least “not yet”, to any idea or requirement that competes with your goal. Once you're there, try to keep the same mindset. The next step is not just checking off a list of features required for 1.0. It is finding the set of use cases that real customers will need for a compelling first release and addressing only those use cases. Address each of these as a series of additional MVPs; try to find the same focus and clarity of purpose. Meanwhile, keep your code shippable and production-ready to minimize the amount of pre-release “productization” and the amount of technical debt to deal with afterward. Get the MVP into the hands of a few users immediately, and be prepared to go agile and change your plans based on their feedback.

Keep to this path and you will arrive at the MVAP: the [minimum viable awesome product][MVAP]. Now, you are ready to ship.

[mvp-def]: https://en.wikipedia.org/wiki/Minimum_viable_product
[Trello]: https://trello.com/mmertsock/recommend
[saying no]: https://www.youtube.com/watch?v=H8eP99neOVs
[MVAP]: https://blog.carbonfive.com/introducing-mvap-the-minimum-viable-awesome-product/
