import { expect, test } from "bun:test";
import { DoublyLinkedList } from "../src/DoublyLinkedList";

test("DoublyLinkedList", () => {
	const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	const insertedValue: [number, number] = [5, 100];
	const fullData = [1, 2, 3, 4, 5, 100, 6, 7, 8, 9, 10];
	const appendedData = [...data.slice().reverse(), ...fullData];

	const listFront = new DoublyLinkedList<number>();
	for (const entry of data) listFront.addFront(entry);
	for (let i = 0; i < data.length; i++) expect(listFront.nth(i)).toBe(data[data.length - i - 1]);
	expect(listFront.size()).toBe(data.length);

	const listEnd = new DoublyLinkedList<number>();
	for (const entry of data) listEnd.addEnd(entry);
	for (let i = 0; i < data.length; i++) expect(listEnd.nth(i)).toBe(data[i]);
	expect(listEnd.size()).toBe(data.length);

	listEnd.insert(insertedValue[1], insertedValue[0]);
	expect(listEnd.nth(insertedValue[0])).toBe(insertedValue[1]);
	for (let i = 0; i < fullData.length; i++) expect(listEnd.nth(i)).toBe(fullData[i]);
	expect(listEnd.size()).toBe(fullData.length);

	listFront.append(listEnd);
	for (let i = 0; i < appendedData.length; i++) expect(listFront.nth(i)).toBe(appendedData[i]);
	expect(listFront.size()).toBe(appendedData.length);

	const list = DoublyLinkedList.from(data);
	expect(list.size()).toBe(data.length);

	list.forEach((value, index) => expect(value).toBe(data[index]));
	let i = 0;
	for (const value of data) {
		expect(value).toBe(data[i]);
		i++;
	}

	expect(list.size()).toBe(data.length);
	while (data.length > 0) {
		const removed = Math.floor(Math.random() * data.length);
		const [value] = data.splice(removed, 1);
		expect(list.remove(value), `Tried to remove '${value}'`).toBeTrue();
	}
	expect(list.size()).toBe(0);
	expect(list.remove(10)).toBeFalse();

	const duplicateData = [1, 1, 2, 3, 3, 3, 3, 4, 5, 6];
	const duplicateList = DoublyLinkedList.from(duplicateData);
	expect(duplicateList.size()).toBe(duplicateData.length);

	while (duplicateData.length > 0) {
		const removed = Math.floor(Math.random() * duplicateData.length);
		const [value] = duplicateData.splice(removed, 1);
		expect(duplicateList.remove(value), `Tried to remove '${value}'`).toBeTrue();
	}
	expect(duplicateList.size()).toBe(0);
});