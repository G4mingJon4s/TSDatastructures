import { expect, test } from "bun:test";
import { Queue } from "../src/Queue";

test("Queue", () => {
	const data = [5, 4, 67, 20, 289, 593, 208];
	const queue = new Queue<number>();

	expect(queue.peek()).toBeNull();
	expect(queue.remove()).toBeNull();

	for (const entry of data) queue.add(entry);
	for (const entry of data) {
		expect(queue.peek()).toBe(entry);
		expect(queue.remove()).toBe(entry);
	}

	expect(queue.peek()).toBeNull();
	expect(queue.remove()).toBeNull();
});