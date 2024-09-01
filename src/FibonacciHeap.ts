import { DoublyLinkedList } from "./DoublyLinkedList";
import type { Heap } from "./Heap";

interface Opts<T> {
	/** Should be true if a < b */
	compare: (a: T, b: T) => boolean;
	key: (a: T) => string;
}

class Entry<T> {
	value: T;
	marked = false;

	parent: Entry<T> | null = null;
	children: DoublyLinkedList<Entry<T>>;

	constructor(item: T) {
		this.value = item;
		this.children = new DoublyLinkedList();
	}

	degree(): number {
		return this.children.size();
	}

	merge(other: Entry<T>, compare: (a: T, b: T) => boolean): Entry<T> {
		const result = compare(this.value, other.value);
		const parent = result ? this : other;
		const child = result ? other : this;

		parent.children.addEnd(child);
		child.parent = parent;
		return parent;
	}

	toString(): string {
		return `${this.value}: { ${this.children} }`;
	}
}

export class FibonacciHeap<T> implements Heap<T> {
	min: Entry<T> | null = null;
	root: DoublyLinkedList<Entry<T>> = new DoublyLinkedList();
	relations: Map<T | string, Entry<T>> = new Map();

	compare: (a: T, b: T) => boolean = (a, b) => a < b;
	key: (a: T) => T | string = a => a;

	constructor(opts?: Opts<T>) {
		if (opts?.compare) this.compare = opts.compare;
		if (opts?.key) this.key = opts.key;
	}

	getMin(): T | null {
		return this.min?.value ?? null;	
	}

	extractMin(): T | null {
		if (this.min === null) return null;
		const minValue = this.min.value;
		
		// Delete min and move children to root
		this.min.children.forEach(child => child.parent = null);
		this.root.append(this.min.children);
		this.root.remove(this.min);

		this.min = null;
		this.relations.delete(this.key(minValue));

		// Clean up 1-degree children
		const sizes: Map<number, Entry<T>> = new Map();
		for (let entry of this.root) {
			let d = entry.degree();
			while (sizes.has(d)) {
				// Merge together
				const other = sizes.get(d)!;
				entry = entry.merge(other, this.compare);

				// Delete from current spot
				sizes.delete(d);
				d++;
			}

			sizes.set(d, entry);
		}

		// Create new root
		this.root = DoublyLinkedList.from(sizes.values(), entry => {
			if (this.min === null || this.compare(entry.value, this.min.value)) this.min = entry;
		});

		return minValue;
	}

	insert(item: T): void {
		const entry = new Entry(item);
		this.root.addEnd(entry);
		this.relations.set(this.key(item), entry);
		if (this.min === null) this.min = entry;
		if (this.compare(item, this.min.value)) this.min = entry;
	}

	decreaseKey(item: T, newValue: T): boolean {
		// Find reference to entry
		const entry = this.relations.get(this.key(item));
		if (entry === undefined) return false;

		// Change reference to new value
		entry.value = newValue;
		this.relations.delete(this.key(item));
		this.relations.set(this.key(newValue), entry);

		if (entry.parent === null) {
			if (this.min === null) this.min = entry;
			if (this.compare(entry.value, this.min.value)) this.min = entry;
			return true;
		}


		if (this.compare(entry.parent.value, entry.value)) return true;

		this.cutOut(entry);
		return true;
	}

	private cutOut(entry: Entry<T>): void {
		if (entry.parent === null) return;
		entry.parent.children.remove(entry);
		entry.marked = false;
		this.root.addEnd(entry);

		if (this.min === null || this.compare(entry.value, this.min.value)) this.min = entry;

		if (entry.parent.marked) {
			this.cutOut(entry.parent);
		} else entry.parent.marked = true;

		entry.parent = null;
	}
}

const data = [20, 15, 32, 9, 520, 123, 538, 283, 175, 40];

const heap = new FibonacciHeap<number>();

console.log("Inserting data...");
for (const value of data) {
	heap.insert(value);
}

console.log("Testing extract");
heap.extractMin();

console.log("Testing decrease");
heap.decreaseKey(520, 519);
heap.decreaseKey(20, 1);
heap.insert(2);
heap.decreaseKey(2, 0);
heap.insert(100);

console.log("Output:");
while (heap.getMin() !== null) {
	const value = heap.extractMin();
	console.log(value);
	await new Promise(res => setTimeout(res, 1000));
}