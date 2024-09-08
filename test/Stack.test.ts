import { expect, test } from "bun:test";
import { Stack } from "../src/Stack";

test("Stack", () => {
	const data = [5, 4, 6, 2, 65, 100];
	const stack = new Stack<number>();

	expect(stack.pop()).toBeNull();

	for (const entry of data) stack.push(entry);
	for (let i = data.length - 1; i >= 0; i--) {
		const output = stack.pop();

		expect(output).toBeNumber();
		expect(output).toBe(data[i]);
	}

	expect(stack.pop()).toBeNull();
});