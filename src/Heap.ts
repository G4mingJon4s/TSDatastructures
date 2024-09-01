export interface Heap<T> {
	getMin(): T | null;
	extractMin(): T | null;
	insert(item: T): void;
	decreaseKey(item: T, newValue: T): void;
}