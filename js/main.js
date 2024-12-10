class RotatingHeader {
	static shared;
	midSpan;
	endSpan;
	intervals;
	separators;
	index;
	
	constructor(elem, intervals, separators) {
		this.midSpan = elem.querySelector(".r-punct-mid");
		this.endSpan = elem.querySelector(".r-punct-end");
		this.intervals = intervals;
		this.separators = separators;
		this.index = 0;
		
		if (!this.midSpan || !this.endSpan || (this.intervals.length == 0) || (this.separators.length < 2)) {
			return;
		}
		
		this.scheduleNext();
	}
	
	scheduleNext() {
		if (this.intervals.length > 1) {
			window.setTimeout(() => this.next(), this.intervals.shift());
		} else {
			window.setTimeout(() => this.next(), this.intervals[0]);
		}
	}
	
	next() {
		if (this.index == 0) { this.randomize(); }
		let glyphs = this.separators[this.index].split("");
		this.midSpan.innerText = glyphs[0];
		this.endSpan.innerText = glyphs.length > 1 ? glyphs[1] : " ";
		this.index = (this.index + 1) % this.separators.length;
		this.scheduleNext();
	}
	
	randomize() {
		if (this.separators.length < 2) { return; }
		let last = this.separators[this.separators.length - 1];
		let currentIndex = this.separators.length;
		while (currentIndex > 0) {
			let randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			this.swap(currentIndex, randomIndex);
		}
		// Don't repeat
		if (this.separators[0] == last) {
			let randomIndex = 1 + Math.floor(Math.random() * (this.separators.length - 1));
			this.swap(0, randomIndex);
		}
	}
	
	swap(a, b) {
		let temp = this.separators[a];
		this.separators[a] = this.separators[b];
		this.separators[b] = temp;
	}
}
RotatingHeader.shared = new RotatingHeader(document.querySelector("header h1"), [6400, 4800, 3600], ["|", "/", ":", "&", ",.", ";", "×", "+", "•", "#", "*", "±", "≟", "∩", "∻", "∫", "∀", "↑", "()", "[]", "{}", "<>"]);

// document.querySelectorAll("article h2[id], article h3[id]").forEach(elem => {
// 	if (elem.id.trim().length == 0) { return; }
// 	elem.classList.toggle("linkified-id", true);
// });
// 
// document.querySelectorAll(".linkified-id").forEach(elem => {
// 	console.log(`${elem.id} => ${elem.innerText}`);
// 	let a = document.createElement("a");
// 	a.href = `#${elem.id}`;
// 	a.innerText = "⛓";
// 	a.classList.toggle("linkifier", true);
// 	elem.prepend(a);
// });
