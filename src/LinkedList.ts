export class LinkedList<T> {
	value: T;
	next: LinkedList<T> | null = null;

	constructor(value: T) {
		this.value = value;
	}
}