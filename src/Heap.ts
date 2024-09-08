export interface Opts<T> {
	/** Should be true if a < b */
	compare?: (a: T, b: T) => boolean;
	key?: (a: T) => string;
}

export interface Heap<T> {
	getMin(): T | null;
	extractMin(): T | null;
	insert(item: T): void;
	decreaseKey(item: T, newValue: T): boolean;
}