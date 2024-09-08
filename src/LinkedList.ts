export class LinkedList<T> {
	value: T;
	next: LinkedList<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}

	append(value: T): void {
		let current: LinkedList<T> = this;
		while (current.next !== null) current = current.next;
		current.next = new LinkedList(value);
	}

	concat(list: LinkedList<T>): void {
		let current: LinkedList<T> = this;
		while (current.next !== null) current = current.next;
		current.next = list;
	}

	nth(index: number): T | null {
		let current: LinkedList<T> = this;
		while (current.next !== null && index-- > 0) current = current.next;
		if (index > 0) return null;
		return current.value;
	}
	
	size(): number {
		let num = 0;
		let current: LinkedList<T> = this;
		while (num++, current.next !== null) current = current.next;
		return num;
	}
}