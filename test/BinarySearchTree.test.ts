import { expect, test } from "bun:test";
import { BinarySearchTree } from "../src/BinarySearchTree";

test("BinarySearchTree", () => {
	const data = [5, 4, 20, 39, 23, 53, 21];
	const sorted = data.toSorted((a, b) => a - b);

	const tree = new BinarySearchTree();
	expect(tree.size()).toBe(0);

	for (const entry of data) tree.insert(entry);
	expect(tree.size()).toBe(data.length);

	expect(tree.inorder()).toEqual(sorted);
	expect(tree.includes(data[3])).toBeTrue();
	expect(tree.includes(9999)).toBeFalse();

	while (data.length > 0) tree.remove(data[0]), data.shift();
	expect(tree.size()).toBe(0);
});