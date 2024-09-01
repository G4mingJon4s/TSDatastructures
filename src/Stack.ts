import { LinkedList } from "./LinkedList";

export class Stack<T> {
	head: LinkedList<T> | null = null;

	push(item: T): void {
		const entry = new LinkedList(item);
		entry.next = this.head;
		this.head = entry;
	}

	pop(): T | null {
		if (this.head === null) return null;

		const value = this.head.value;
		this.head = this.head.next;

		return value;
	}
}