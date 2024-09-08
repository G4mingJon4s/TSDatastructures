import { expect, test, beforeAll, setSystemTime, beforeEach } from "bun:test";
import { FibonacciHeap } from "../src/FibonacciHeap";
import { BinaryHeap } from "../src/BinaryHeap";
import type { Heap, Opts } from "../src/Heap";

const createMockData = (size: number): {
	data: { value: number }[],
	decreasedValues: [{ value: number }, { value: number }][],
	changedData: { value: number }[]
} => {
	if (size < 10) throw new Error(`Size '${size}' is too small. It should be at least 10`);

	const data: { value: number }[] = Array.from({ length: size }, () => ({
		value: Math.floor(Math.random() * size)
	}));

	const decreasedValues: [{ value: number }, { value: number }][] = [];
	const changedData: { value: number }[] = [];

	for (let i = 0; i < data.length; i++) {
		const changed = Math.random() < (1 / 10);
		if (!changed) {
			changedData.push(data[i]);
			continue;
		}

		const newEntry = { value: Math.random() * data[i].value };
		changedData.push(newEntry);
		decreasedValues.push([data[i], newEntry]);
	}

	return { data, decreasedValues, changedData };
};

let mockData: ReturnType<typeof createMockData>;
let normalOrder: ReturnType<typeof createMockData>["data"];
let changedOrder: ReturnType<typeof createMockData>["changedData"];

const initData = (size = 1e4) => mockData = createMockData(size);
const initOrder = () => {
	normalOrder = mockData.data.toSorted((a, b) => a.value - b.value);
	changedOrder = mockData.changedData.toSorted((a, b) => a.value - b.value);
}
beforeAll(() => initData());
beforeEach(() => initOrder());

const testHeap = (createHeap: <T>(opts?: Opts<T>) => Heap<T>) => () => {
	const { data, decreasedValues } = mockData;
	const min = normalOrder[0];

	const heap = createHeap<{ value: number }>({
		compare: (a, b) => a.value < b.value
	});
	expect(heap.getMin()).toBeNull();
	expect(heap.extractMin()).toBeNull();
	expect(heap.decreaseKey({ value: 5 }, { value: 3 })).toBeFalse();

	for (const entry of data) heap.insert(entry);

	while (heap.getMin() !== null) {
		const found = heap.extractMin();
		expect(found !== null).toBeTrue();

		expect(normalOrder.length).toBeGreaterThan(0);
		const expected = normalOrder.shift()!;

		expect(found).toStrictEqual(expected);
	}
	expect(heap.extractMin()).toBeNull(); // implicitly checked getMin through while

	for (const entry of data) heap.insert(entry);
	expect(heap.getMin()).toStrictEqual(min);

	for (const [old, changed] of decreasedValues) heap.decreaseKey(old, changed);
	expect(heap.getMin()).toStrictEqual(changedOrder[0]);

	while (heap.getMin() !== null) {
		const found = heap.extractMin();
		expect(found !== null).toBeTrue();

		expect(changedOrder.length).toBeGreaterThan(0);
		const expected = changedOrder.shift()!;

		expect(found).toStrictEqual(expected);
	}
	expect(heap.extractMin()).toBeNull(); // implicitly checked getMin through while
};

test("BinaryHeap", testHeap(opts => new BinaryHeap(opts)), {
	repeats: 2
});

test("FibonacciHeap", testHeap(opts => new FibonacciHeap(opts)), {
	repeats: 2
});