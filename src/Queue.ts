import { DoublyLinkedList } from "./DoublyLinkedList";

export class Queue<T> {
	data: DoublyLinkedList<T> = new DoublyLinkedList();

	add(item: T): void {
		this.data.addFront(item);
	}

	peek(): T | null {
		return this.data.tail?.value ?? null;
	}

	remove(): T | null {
		if (this.data.tail === null) return null;
		const entry = this.data.tail;
		const prev = entry.prev;

		if (prev === null) {
			this.data.head = null;
			this.data.tail = null;
		} else {
			this.data.tail = prev;
			prev.next = null;
		}

		return entry.value;
	}

	size(): number {
		return this.data.size();
	}
}