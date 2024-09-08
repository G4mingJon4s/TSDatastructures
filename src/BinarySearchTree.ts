export interface Opts<T> {
	/** Should be true if a < b */
	compare?: (a: T, b: T) => boolean;
	/** Should be true if a === b */
	equals?: (a: T, b: T) => boolean;
}

export class BinarySearchTree<T> {
	tree: BSTEntry<T> | null = null;

	compare: (a: T, b: T) => boolean = (a, b) => a < b;
	equals: (a: T, b: T) => boolean = (a, b) => a === b;

	constructor(opts?: Opts<T>) {
		const { compare, equals } = opts ?? {};
		if (compare) this.compare = compare;
		if (equals) this.equals = equals;
	}

	insert(item: T): void {
		if (this.tree === null) this.tree = new BSTEntry<T>(item, {
			compare: this.compare,
			equals: this.equals
		});
		else this.tree.insert(item);
	}

	includes(item: T): boolean {
		return this.tree !== null && this.tree.includes(item);
	}

	remove(item: T): void {
		if (this.tree !== null) this.tree = this.tree.remove(item);
	}

	size(): number {
		if (this.tree === null) return 0;
		return this.tree.size();
	}

	/** Will return -1 if the tree is null */
	height(): number {
		if (this.tree === null) return -1;
		return this.tree.height();
	}

	inorder(): T[] {
		if (this.tree === null) return [];
		return this.tree.inorder();
	}

	preorder(): T[] {
		if (this.tree === null) return [];
		return this.tree.preorder();
	}

	postorder(): T[] {
		if (this.tree === null) return [];
		return this.tree.postorder();
	}
}

export class BSTEntry<T> {
	value: T;
	left: BSTEntry<T> | null = null;
	right: BSTEntry<T> | null = null;

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
			if (this.left === null) this.left = new BSTEntry(item, { compare: this.compare, equals: this.equals });
			else this.left.insert(item);
			return;
		}
		if (this.right === null) this.right = new BSTEntry(item, { compare: this.compare, equals: this.equals });
		else this.right.insert(item);
	}

	/** Modifies in place and returns a reference to the same object or null. */
	remove(item: T): BSTEntry<T> | null {
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
		if (this.left !== null && this.right !== null) {
			const [left, right] = [this.left, this.right];

			let pointer = this.left;
			let prev: BSTEntry<T> = this;
			while (pointer.right !== null) {
				prev = pointer;
				pointer = pointer.right;
			}

			// Replace the chosen entry with its left child
			prev.right = pointer.left;

			// Redirect children to chosen entry
			if (left !== pointer) pointer.left = left;
			else pointer.left = null;
			pointer.right = right;

			return pointer;
		}

		return this.left ?? this.right;
	}

	size(): number {
		return 1 + (this.left?.size() ?? 0) + (this.right?.size() ?? 0);
	}

	height(): number {
		return Math.max(this.left?.height() ?? 0, this.right?.height() ?? 0);
	}

	inorder(): T[] {
		return [...this.left?.inorder() ?? [], this.value, ...this.right?.inorder() ?? []];
	}

	preorder(): T[] {
		return [this.value, ...this.left?.preorder() ?? [], ...this.right?.preorder() ?? []];
	}

	postorder(): T[] {
		return [...this.left?.postorder() ?? [], ...this.right?.postorder() ?? [], this.value];
	}
}