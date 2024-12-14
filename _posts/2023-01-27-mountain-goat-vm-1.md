---
title: "Building a Computer From Scratch: Level 1"
layout: post
---

Follow along as we build a fake computer architecture and assembly language from scratch, with a virtual machine/interpreter written in JavaScript. Why? I saw a fun YouTube video that posed the question: ["Can you fit a whole game into a QR code?"][YouTube]. Long story short, this intersected with my hobby of [dabbling with JavaScript games and game engines][eskergames] and some recent reading about 16-bit era games being written in assembly code, forming this Venn diagram in my mind:

<figure>
	<a href="{{ site.url }}/assets/posts/mountain-goat-venn-2x.png"><img src="{{ site.url }}/assets/posts/mountain-goat-venn-2x.png" srcset="{{ site.url }}/assets/posts/mountain-goat-venn.png 1x, {{ site.url }}/assets/posts/mountain-goat-venn-2x.png 2x" alt="Venn diagram, three circles labeled (1) 'Cool idea: embed a game in a QR code'. (2) 'Hobby: tinkering with with JS games and game engines'. (3) 'Reading about: 16-bit era games written in assembly'. Intersection labeled 'Build my own assembly language, computer architecture, virtual machine, in JS, from scratch'"></a>
</figure>

Basically, I've always been interested in game development, but I always stall working on actual games and become more invested in tinkering with the systems and frameworks that games are built with.

Anyway, in the video, embedding was achieved by constructing a QR code that encoded the raw binary content of an x86 executable file. How would this work for a JavaScript/HTML game? A straightforward answer: just encode the text of an HTML document with inline JavaScript into the QR code. That's a lot of code to embed. So another option is encode just the JavaScript in the QR code, and then have a web page run `eval` on that code. But that's an ["enormous security risk"][eval] 😰. Then I thought about those old game cartridges hand-coded in assembly and executed on a console in a dedicated runtime. And there's the recent trend of deliberately constrained game environments like Pico-8. So I thought it would be fun to make a simulated computer where the "cartridge" is a QR code. Or at least, it's an excuse to play around with designing a system at a _much_ lower level than my everyday work.

So here's some blogging about my experiments with this idea.

<blockquote class="warn">
🤷🏼 <em>First, some massive caveats:</em> Don't take any of this seriously. Nothing you see here is going to be rigorous or correct. This is all based on a few courses in assembly language and language theory long ago during college and grad school, some experience writing apps in C and Fortran, and just the general vibes I have from years of torturing sand. It will be built incrementally, only what's necessary to make something interesting work. But maybe we'll learn some things.
</blockquote>

What do we need in order to build it? Maybe this:

- We need to design a [computer architecture][].
- Define machine instructions that it understands.
- And also design an assembly language that maps to that machine language, because we want our code to be human-readable.
- The machine needs some form of memory.
- And it needs a system for input and output.
- Then we will have an interpreter that runs inside an actual web browser, which constructs this virtual machine, feeds it assembly code, attaches inputs to browser input events, and somehow attaches output to the DOM.
- We're not going to go too far down in the simulation. Not constructing logic gates or transistors or adder circuits. Might gloss over a lot of the details at the level of individual bits.
- Is that all?

## Level 1: setup, accumulator, addition

Here's a repo: [`mountain-goat-vm`][repo]. Named as such because I like mountains, goats are cool, and this will be like building a little mountain one stone at a time. I'll post source code there and also host a copy on Glitch that's ready to run in your browser.

As a first step toward building an assembly language—which is the real meat of what I wanted to play with—we'll just implement a simple `ADD` instruction. A lot of the initial work is not the machine itself but establishing the HTML/JS chrome to host this project. Input boxes and text areas. A simple [REPL][] to execute instructions one at a time, and a "program loader" to execute a block of code. Here's the definition for our `ADD` instruction (as produced by the HELP command in our REPL):

```
ADD: Sets $R0 = $R0 + $R1
Example: ADD
```

`$R0` indicates register number 0, etc. So our machine needs two registers (_only_ two for now—only implementing what we need and nothing more—but surely we'll add more registers later). Since there are only two registers and addition is [commutative][], our `ADD` instruction doesn't actually need to be told which registers to add, and thus an `ADD` statement has no arguments. The result goes into $R0, which I guess means our machine is currently just an "accumulator". Which is all it can do right now, no real logic, so that sounds right.

Let's assume the machine is initialized with all registers set to zero. It's easy to see the `ADD` instruction alone [produces no information][entropy]. So we'll add one more instruction to set a register:

```
SET: Sets $Rn to integer value i
Example: SET n i
n: register [0 - 1]
i: word [0 - 65535]
```

Now we have an adding machine. Feel free to use this to file your taxes this year.

```
SET 0 3
> [3] [0]
SET 1 4
> [3] [4]
ADD
> [7] [4]
SET 1 2
> [7] [2]
ADD
> [9] [2]
```

[Try it out yourself in a browser on Glitch.][glitch-level-1]

## Implementation details

Full source code is on Github in [branch `level-1`][branch-level-1].

**[assembly.js](https://github.com/mmertsock/mountain-goat-vm/blob/level-1/assembly.js)** is where the computer itself is implemented.

The `Machine` class represents an instance of the computer itself. It has registers that hold data, and simulates the lowest-level [machine code][] to manipulate individual registers. It's rather passive right now, notably because we don't yet have a need for a [program counter][] to track which instruction to execute next (e.g. for actual logic). For now, our web app just tells the machine which instructions to execute; the machine can get more agency later.

The `DataType` and `Instruction` classes are all at a meta level: they define categories of data and behavior, not individual instances of instructions or data. They describe how the computer works and will form the basis of our assembly language, memory system, etc. For example, `addRegisters` is an instance of Instruction that describes how the ADD instruction works. `setRegister` is actually a factory method that produces versions of `SET` instructions for machines with different numbers of registers (to prevent propagating the assumption that our machine has only two registers, since that will certainly change).

The `Program` and `REPL` classes do most of the heavy lifting right now, they parse assembly language text input, determine the Instructions each input statement represents, and tells the machine to execute those instructions using any parsed arguments. For now, we're skipping the step of encoding these statements as binary machine code: it's all operating symbolically, more like "Machine, execute an ADD instruction" rather than the Machine decoding and interpreting a value 0x0010 in some memory or register location as an ADD instruction. Currently these classes are directly driving the operation of Machine, but in future iterations the Machine will need to run itself with the Program and REPL acting more as clients or I/O interfaces for it.

`REPL` understands one additional keyword that isn't an actual Instruction: `HELP`. It gathers and displays metadata from all of the actual Instructions that the Machine declares as supporting, for the benefit of the programmer.

**[index.html](https://github.com/mmertsock/mountain-goat-vm/blob/level-1/index.html)** hosts the machine and all the HTML/CSS/JS chrome to display the inputs and outputs. It interacts with the `Program` and `REPL` classes above based on user input. Pretty simple.

Note that so far, the virtual machine has no true interaction with the outside world. No memory, no I/O. Our web app is directly parsing and feeding it instructions to execute from user input, and directly inspecting the registers to show what happened. It would be like using microscopes or oscilloscopes pointed at a CPU and calling that the "output" of a real computer. At some point we'll need concepts for memory and I/O.

[Ping me on Mastodon][mastodon-post] to discuss.

## What's next

Multiplication. This will require a program counter and some additional instructions to branch, jump, and decrement. The beginnings of some real computing.

[YouTube]: https://youtu.be/ExwqNreocpg
[eskergames]: https://github.com/mmertsock/eskergames
[eval]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
[computer architecture]: https://en.wikipedia.org/wiki/Instruction_set_architecture
[repo]: https://github.com/mmertsock/mountain-goat-vm
[branch-level-1]: https://github.com/mmertsock/mountain-goat-vm/tree/level-1
[entropy]: https://en.wikipedia.org/wiki/Entropy_(information_theory)
[glitch-level-1]: https://mmertsock-mountain-goat-vm.glitch.me/level-1.html
[REPL]: https://en.wikipedia.org/wiki/Read–eval–print_loop
[commutative]: https://en.wikipedia.org/wiki/Commutative_property
[machine code]: https://en.wikipedia.org/wiki/Machine_code
[program counter]: https://en.wikipedia.org/wiki/Program_counter
[mastodon-post]: https://iosdev.space/@mmertsock/109764956915503153
