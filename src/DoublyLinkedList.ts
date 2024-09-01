interface Entry<T> {
	value: T;
	prev: Entry<T> | null;
	next: Entry<T> | null;
}

export class DoublyLinkedList<T> {
	head: Entry<T> | null = null;
	tail: Entry<T> | null = null;

	addFront(value: T): void {
		const entry = {
			value,
			prev: null,
			next: this.head,
		};

		if (this.head) this.head.prev = entry;
		this.head = entry;
		if (this.tail === null) this.tail = this.head;
	}

	addEnd(value: T): void {
		const entry = {
			value,
			prev: this.tail,
			next: null
		};

		if (this.tail) this.tail.next = entry;
		this.tail = entry;
		if (this.head === null) this.head = this.tail;
	}

	insert(value: T, index: number): void {
		if (index === 0) return this.addFront(value);

		let prev: Entry<T> | null = this.head;
		for (let i = 0; i < index - 1; i++) prev = prev !== null ? prev.next : null;

		if (prev === null || prev === this.tail) return this.addEnd(value);

		const entry = {
			value,
			prev,
			next: prev.next
		};

		prev.next = entry;
	}

	append(other: DoublyLinkedList<T>): void {
		// Check if something is stored first
		if (other.head === null || other.tail === null) return;

		if (this.tail === null) {
			this.head = other.head;
			this.tail = other.tail;
			return;
		}

		this.tail.next = other.head;
		this.tail = other.tail;
	}

	remove(value: T): boolean {
		// Check if something is stored first
		if (this.head === null || this.tail === null) {
			console.error("No entries");
			return false;
		}

		let entry: Entry<T> | null = this.head;
		while (entry !== null && entry.value !== value) entry = entry.next;

		if (entry === null) {
			console.error("Not found");
			return false;
		}
		if (entry.prev === null) this.head = this.head.next;
		if (entry.next === null) this.tail = this.tail.prev;

		if (entry.prev !== null || entry.next !== null) {
			const prev = entry.prev;
			const next = entry.next;

			if (prev !== null) prev.next = next;
			if (next !== null) next.prev = prev;
		}

		return true;
	}

	includes(item: T): boolean {
		let entry = this.head;
		while (entry !== null && entry.value !== item) entry = entry.next;
		return entry?.value === item;
	}

	get(index: number): T | null {
		let entry = this.head;
		for (let i = 0; i < index; i++) entry = entry?.next ?? null;
		return entry?.value ?? null;
	}

	size(): number {
		let current = this.head;
		let size = 0;

		while (current !== null) {
			size++;
			current = current.next;
		}

		return size;
	}

	forEach(func: (value: T) => void): void {
		let current = this.head;

		while (current !== null) {
			func(current.value);
			current = current.next;
		}
	}

	values(): Iterator<T> {
		let current = this.head;

		return {
			next(): IteratorResult<T, null> {
				const value = current?.value ?? null;
				current = current?.next ?? null;

				if (value === null) return { done: true, value: null };
				return { done: false, value };
			}
		}
	}

	[Symbol.iterator] = this.values;

	toString(): string {
		if (this.size() === 0) return "DLL (0)";
		const values = [];
		for (const ell of this) values.push(`[${ell}]`);
		if (this.size() < 2) return `DLL (${this.size()}): ${values[0]}`;

		return `DLL (${this.size()}):\n${values.map(v => "  " + v.replaceAll("\n", "\n  ")).join("\n")}`;
	}

	static from<T>(values: Iterable<T>, action?: (value: T) => void): DoublyLinkedList<T> {
		const list = new DoublyLinkedList<T>();
		for (const entry of values) {
			list.addEnd(entry);
			if (action) action(entry);
		}
		return list;
	}
}