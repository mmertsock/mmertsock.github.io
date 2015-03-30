---
title: "On Writing APIs: Collaborating Effectively With Your Mobile Team"
layout: post
excerpt: "API-driven mobile app development requires more than good engineers and the latest technology. Whether your organization is a startup, or an established company expanding into the mobile space, you may be creating the app and API in parallel. The mobile and API teams will need to collaborate effectively in order to launch a successful product. In fact, I would say that communication and teamwork can be more important than the choice of server-side and client-side technologies."
---

API-driven mobile app development requires more than good engineers and the latest technology. Whether your organization is a startup, or an established company expanding into the mobile space, you may be creating the app and API in parallel. The mobile and API teams will need to collaborate effectively in order to launch a successful product. In fact, I would say that communication and teamwork can be more important than the choice of server-side and client-side technologies.

Mobile and API developers can write great code in their respective silos, but if the interaction between the two teams is not top-notch, the interaction of the app and API will reflect that. Teams will end up with divergent understanding of the work. Timelines will get out of sync. Developers will be fighting to get the client and server to work together as anti-patterns and incompatible interfaces emerge. Every new feature will repeat a cycle rehashing the same bugs, fighting the same structures, duplicating slight variations of boilerplate “solutions” to the architecture problems. Friction will rule both the programming work and team dynamics.

## Eleven tips for successful collaboration

Regardless of the technology in use or the scale of the project, there are several communication, design, and implementation techniques that API and mobile teams can use to improve their success.

### A shared vision and common language

Have the API team involved directly in the mobile app work. Developers from both sides should collaborate on the initial design decisions. A common business language prevents developers from having to constantly translate concepts to and from the mobile and API domains, thus reducing frustration and misunderstandings. By working on some shared user stories and common milestones, there are fewer conflicts of resource allocation and prioritization between API and mobile teams.

### Teams should work closely together, at all levels, on a daily basis

Teams should share stakeholders and project/product managers. There should be daily communication between developers; perhaps both teams or at least representatives from each have a shared Scrum session if logistics allow.

### Define the API interface based on user stories and business needs

An API interface should speak the language of the API consumer, *not* the underlying technology. A common naïve API implementation may look like a thin [CRUD][] layer over a database. This may be a design smell if the domain model and use cases do not mirror the database that closely. With modern frameworks and development tools, there should be minimal pain in translating API requests to the underlying data model.

### Solve business needs rather than technical requirements to achieve ROI with reusable APIs

In addition to allowing the interface to be dictated by the server database, another API design smell is directly modeling the internal structure of the mobile app. This will lead down the slippery slope of mobile app changes requiring versioning the API, and all the complexity that implies. Instead, API endpoints should describe business objects and operations, and parameters and data types should further reflect the business language for specific use cases. This allows the API to potentially be usable by a variety of clients (e.g. your website or third party integrations), and can force better and more maintainable implementations on both the client– and server-side. Note that coordinating focus on higher level business needs requires the above practices of shared vision and daily team interaction.

### Implement both the client and server incrementally

Think Agile—both teams should start by implementing a single use case end-to-end. Start with one fully functional API endpoint and get the mobile app using that API. The teams continue to work together, incrementally building out more API and client functionality, directed by user stories. This keeps the teams in sync. As a rhythm of design, implementation, and testing emerges, teams can optimize their resource allocation (think Kanban).

### Establish patterns and make the API self-documenting

Hand-written documentation has its place, but make it a goal to achieve a largely self-documenting API. A shared language focused on business concepts instead of technical terms, as described above, is essential for this. Use self-evident naming conventions so that parameters and paths are increasingly obvious to users, and find tools to generate user-facing documentation from code comments/attributes and validation rules.

With our API, it often felt that we spent half our time working on the interface design in the early stages. This has paid off in reduced cognitive load, as pattern recognition is a human strength. Patterns invoke all the experience gained consuming similar API endpoints as new APIs are added. The mobile team will find the API increasingly easy to use, due to reuse not of code, but of *concepts*.

### Use stub endpoints to improve velocity

When building new endpoints, focus on quickly getting a stub of the new interface in a test environment before writing a single line of code for the actual implementation. This allows the client-side developers to get started on their implementation in parallel, and allows additional time to make changes to the interface if necessary.

The API stub should include the entire *interface contract*—request and response schema, validation/authorization rules, and HTTP status codes—but an empty or hard-coded response body. A good API framework should allow for rapid development of these interfaces with a stub service implementation.

### Provide tools for debugging, QA, and regression testing

The UI of a mobile app is not conducive to debugging and testing API interactions. It is up to the teams to support each other. Developers will appreciate server-side logging, instrumentation, and debugging proxies; the mobile team should make the API hostname, etc., configurable in dev builds; QA teams will find it useful to have tools for directly exercising API endpoints, and can help keep developers focused on the use cases.

### Have QA test the API directly, or write automated tests

API tests should be focused on use cases, from the perspective of the API consumer or, by proxy, the end user. APIs are a prime target for [integration testing][] or an automated regression suite: API tests are easy to automate, the output is predictable, and stability/backward compatibility is essential.

### Don’t be afraid to change direction

If an API or client-side design pattern is causing headaches, be willing to throw it out in favor of something better. You may need to keep some of the old implementation around (for example, in outdated but in-use API endpoints), but it will probably pay off to move forward with a better design.

### Consider a pilot or prototype phase to buy time for design experimentation

In both API and the mobile app development, much can be gained by having some time to iterate the large scale design. What looks like a good API design pattern or a good MVC architecture may prove unworkable, but you may need to attempt implementing a few features before this becomes clear. To get the most out of this, both teams should have the opportunity to work together on this phase.

## The impact is substantial

These suggestions are based on my involvement in an ongoing, [successful][TrackAbout] API + smartphone implementation. As our teams have worked together using the practices described above, the quality and efficiency of our work has improved with each new feature and API endpoint. Even after months of working together, we still see measurable acceleration in our work as patterns and practices continue to solidify. The API, while having evolved a bit, has proven to be stable and reusable with little versioning needed. Endpoints are being used by both the mobile app and third-party clients, which adds a lot of value to the API work. The mobile app is robust and scaling well as we add new features.

Though much of this success can be credited to good tools and technology, I think some other elements are just as important: the consistently close collaboration between API and mobile teams, shared stakeholders and vision, a common and consistent language, incremental and parallel workflow, and mutual support.

[CRUD]: https://en.wikipedia.org/wiki/Create,_read,_update_and_delete
[TrackAbout]: https://corp.trackabout.com/modules/smartphone.php
[integration testing]: https://stackoverflow.com/a/19210183/795339
