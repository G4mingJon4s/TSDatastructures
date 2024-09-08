interface Entry<T> {
	value: T;
	prev: Entry<T> | null;
	next: Entry<T> | null;
}

export class DoublyLinkedList<T> {
	protected head: Entry<T> | null = null;
	protected tail: Entry<T> | null = null;
	protected contents = 0;

	addFront(value: T): void {
		const entry = {
			value,
			prev: null,
			next: this.head,
		};

		if (this.head) this.head.prev = entry;
		this.head = entry;
		if (this.tail === null) this.tail = this.head;
		this.contents++;
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
		this.contents++;
	}

	insert(value: T, index: number): void {
		this.contents++;
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
		if (other.head === null || other.tail === null || other.contents === 0) return;
		this.contents += other.contents;

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

		this.contents--;

		return true;
	}

	includes(item: T): boolean {
		let entry = this.head;
		while (entry !== null && entry.value !== item) entry = entry.next;
		return entry?.value === item;
	}

	nth(index: number): T | null {
		let entry = this.head;
		for (let i = 0; i < index; i++) entry = entry?.next ?? null;
		return entry?.value ?? null;
	}

	size(): number {
		return this.contents;
	}

	forEach(func: (value: T, index: number) => void): void {
		let current = this.head;
		let i = 0;

		while (current !== null) {
			func(current.value, i);
			current = current.next;
			i++;
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

	static from<T>(values: Iterable<T>, action?: (value: T) => void): DoublyLinkedList<T> {
		const list = new DoublyLinkedList<T>();
		for (const entry of values) {
			list.addEnd(entry);
			if (action) action(entry);
		}
		return list;
	}
}