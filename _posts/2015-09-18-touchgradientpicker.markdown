---
title: Introducing TouchGradientPicker
layout: post
---

One of the features of my new iOS app [Dayly Calendar][] is the ability to pick a color theme for each of your calendars. The default is a simple black and white theme, but the user can also select a colorful gradient for the calendar background, and some complementary tint colors for the calendar grid and buttons.

I wanted to give users the freedom to follow their creativity and make color theme selection a very personal choice, while ensuring that it wasn't possible to choose a theme that would make the app unusable. A short predefined list of of gradients would be easy and safe to implement, but also too limiting and presumptuous. I could have taken a page from image editor software and presented color pickers or slider controls for each endpoint of the gradient, but that felt too technical, complicated, and impersonal. I wanted this feature to be fun, to add a little *user delight* to the app.

The solution was to create a color gradient control that gave users a visceral feeling of directly manipulating colors by embracing the analog nature of touch gestures. Touch is imprecise, but intuitive and multidimentional. Associate various touch gestures with individual color components in a gradient, and you can create an interactive space in which the user can explore gradients.

A gradient is defined over several dimensions (three dimensions of color components, and at least two colors) of floating point values. I found that just two dimensions of direct manipulation—horizontal and vertical touch gestures (yes multitouch could increase the number of dimensions but I decided it was unnecessary complexity)—gave the user a surprisingly open space for exploring gradients. By carefully choosing what color components the gestures map to (in this case, hues), and keeping other color components (saturation/brightness/opacity) constant, I could allow the user to explore an extensive palette of gradients while ensuring that every possible gradient would work well, look good, and provide sufficient contrast to the text and buttons in the app.

[TouchGradientPicker][GitHub] is the result of this work. It's an open-source UIKit library that provides two controls: `GradientView`, which simply renders a gradient, and `TouchGradientPicker` itself, which translates touch gestures into transformations on a color gradient. It's highly customizable, allowing you to determine exactly how gestures map to transformations on the gradient. Head over to [GitHub][] to check it out and see some demo code, and then clone it (or set up a [Carthage][] dependency) and add it to your app! [Let me know][] if you include it in your app, and submit those pull requests.

[GitHub]: https://github.com/mmertsock/TouchGradientPicker
[Dayly Calendar]: https://www.esker-apps.com/dayly/
[Carthage]: https://github.com/Carthage/Carthage
[Let me know]: https://twitter.com/mmertsock
