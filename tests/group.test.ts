import { describe, expect, it } from "vitest";
import { Circle, Group, Rect } from "../src/index.js";

describe("Group", () => {
	it("should generate an empty group element with no attributes", () => {
		const group = new Group();
		expect(group.toString()).toBe("<g></g>");
	});

	it("should include fill attribute when specified", () => {
		const group = new Group({ fill: "blue" });
		expect(group.toString()).toBe('<g fill="blue"></g>');
	});

	it("should include transform attribute when specified", () => {
		const group = new Group({ transform: "translate(10 20)" });
		expect(group.toString()).toBe('<g transform="translate(10 20)"></g>');
	});

	it("should include opacity attribute when specified", () => {
		const group = new Group({ opacity: 0.5 });
		expect(group.toString()).toBe('<g opacity="0.5"></g>');
	});

	it("should include id attribute when specified", () => {
		const group = new Group({ id: "my-group" });
		expect(group.toString()).toContain('id="my-group"');
	});

	it("should include class attribute when className is specified", () => {
		const group = new Group({ className: "layer" });
		expect(group.toString()).toContain('class="layer"');
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const group = new Group({ fill: 'red" onload="alert(1)' });
		const output = group.toString();
		expect(output).not.toContain('"red" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should render children inside the group", () => {
		const group = new Group();
		group.add(new Circle({ cx: 50, cy: 50, r: 25 }));
		expect(group.toString()).toBe(
			'<g><circle cx="50" cy="50" r="25"/></g>',
		);
	});

	it("should render multiple children inside the group", () => {
		const group = new Group();
		group.add(new Circle({ cx: 10, cy: 10, r: 5 }));
		group.add(new Rect({ x: 0, y: 0, width: 100, height: 50 }));
		expect(group.toString()).toBe(
			'<g><circle cx="10" cy="10" r="5"/><rect x="0" y="0" width="100" height="50"/></g>',
		);
	});

	it("should support method chaining on add", () => {
		const group = new Group();
		const result = group
			.add(new Circle({ r: 10 }))
			.add(new Circle({ r: 20 }));
		expect(result).toBe(group);
		expect(group.toString()).toContain('r="10"');
		expect(group.toString()).toContain('r="20"');
	});

	it("should apply presentation attributes to the group tag", () => {
		const group = new Group({ fill: "red", stroke: "black", opacity: 0.8 });
		group.add(new Circle({ cx: 50, cy: 50, r: 25 }));
		const output = group.toString();
		expect(output).toContain('fill="red"');
		expect(output).toContain('stroke="black"');
		expect(output).toContain('opacity="0.8"');
		expect(output).toContain('<circle ');
	});

	it("should support nested groups", () => {
		const inner = new Group({ fill: "blue" });
		inner.add(new Circle({ r: 10 }));
		const outer = new Group({ transform: "translate(50 50)" });
		outer.add(inner);
		expect(outer.toString()).toBe(
			'<g transform="translate(50 50)"><g fill="blue"><circle cx="0" cy="0" r="10"/></g></g>',
		);
	});
});
