interface Opts<T> {
	/** Should be true if a < b */
	compare?: (a: T, b: T) => boolean;
	/** Should be true if a === b */
	equals?: (a: T, b: T) => boolean;
}

export class BinarySearchTree<T> {
	value: T;
	left: BinarySearchTree<T> | null = null;
	right: BinarySearchTree<T> | null = null;

	compare: (a: T, b: T) => boolean;
	equals: (a: T, b: T) => boolean;

	constructor(value: T, opts?: Opts<T>) {
		this.value = value;

		const { compare, equals } = opts ?? {};
		this.compare = compare ? compare : (a, b) => a < b;
		this.equals = equals ? equals : (a, b) => a === b;
	}

	includes(item: T): boolean {
		if (this.equals(item, this.value)) return true;

		if (this.compare(item, this.value)) {
			return this.left !== null && this.left.includes(item);
		}

		return this.right !== null && this.right.includes(item);
	}

	insert(item: T): void {
		if (this.compare(item, this.value)) {
			if (this.left === null) this.left = new BinarySearchTree(item, { compare: this.compare, equals: this.equals });
			else this.left.insert(item);
		}
		if (this.right === null) this.right = new BinarySearchTree(item, { compare: this.compare, equals: this.equals });
		else this.right.insert(item);
	}

	/** Modifies in place and returns a reference to the same object or null. */
	remove(item: T): BinarySearchTree<T> | null {
		if (!this.equals(item, this.value)) {
			if (this.compare(item, this.value)) {
				if (this.left === null) return this;

				this.left = this.remove(item);
				return this;
			}
			if (this.right === null) return this;

			this.right = this.remove(item);
			return this;
		}
		if (this.left === null && this.right === null) return null;
		if (this.left !== null && this.right !== null) {
			let pointer = this.left;
			let prev: BinarySearchTree<T> = this;
			while (pointer.right !== null) {
				prev = pointer;
				pointer = pointer.right;
			}
			// Preserve left child on parent
			prev.right = pointer.left;
			// Redirect children
			pointer.left = this.left;
			pointer.right = this.right;

			// Implicitly delete this by removing its reference
			return pointer;
		}

		return this.left ?? this.right;
	}
}