import { expect, test } from "bun:test";
import { LinkedList } from "../src/LinkedList";

test("LinkedList", () => {
	const dataLeft = [5, 4, 3, 2, 1];
	const dataRight = [6, 7, 8, 9, 10];
	const dataWhole = [5, 4, 3, 2, 1, 6, 7, 8, 9, 10];

	const left = new LinkedList<number>(dataLeft[0]);
	for (let i = 1; i < dataLeft.length; i++) left.append(dataLeft[i]);
	expect(left.value).toBe(dataLeft[0]);

	for (let i = 0; i < dataLeft.length; i++) expect(left.nth(i)).toBe(dataLeft[i]);
	expect(left.size()).toBe(dataLeft.length);

	const right = new LinkedList<number>(dataRight[0]);
	for (let i = 1; i < dataRight.length; i++) right.append(dataRight[i]);

	left.concat(right);
	for (let i = 0; i < dataWhole.length; i++) expect(left.nth(i)).toBe(dataWhole[i]);
	expect(left.size()).toBe(dataWhole.length);
});