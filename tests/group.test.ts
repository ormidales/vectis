import { describe, expect, it } from "vitest";
import { Circle, Group, Rect } from "../src/index.js";

describe("Group", () => {
	it("should generate an empty group element with no attributes", () => {
		const group = new Group();
		expect(group.toString()).toBe("<g/>");
	});

	it("should include fill attribute when specified", () => {
		const group = new Group({ fill: "blue" });
		expect(group.toString()).toBe('<g fill="blue"/>');
	});

	it("should include transform attribute when specified", () => {
		const group = new Group({ transform: "translate(10 20)" });
		expect(group.toString()).toBe('<g transform="translate(10 20)"/>');
	});

	it("should include opacity attribute when specified", () => {
		const group = new Group({ opacity: 0.5 });
		expect(group.toString()).toBe('<g opacity="0.5"/>');
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

	it("should not self-close when a title is set but no children", () => {
		const group = new Group({ title: "My Group" });
		expect(group.toString()).toBe("<g><title>My Group</title></g>");
	});

	it("should not self-close when a SMIL animation is attached but no children", () => {
		const group = new Group({ fill: "red" });
		group.animate({ attributeName: "opacity", from: "1", to: "0", dur: "1s" });
		const output = group.toString();
		expect(output).toContain("<animate");
		expect(output).toContain("</g>");
		expect(output).not.toMatch(/<g[^>]*\/>/);
	});

	it("should include title and children together in the group", () => {
		const group = new Group({ title: "Shapes" });
		group.add(new Circle({ r: 5 }));
		const output = group.toString();
		expect(output).toContain("<title>Shapes</title>");
		expect(output).toContain("<circle");
		expect(output).toContain("</g>");
	});
});

describe("Group.remove", () => {
	it("should remove a shape that was previously added", () => {
		const group = new Group();
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		group.add(circle);
		group.remove(circle);
		expect(group.toString()).toBe("<g/>");
	});

	it("should be a no-op when the shape is not in the group", () => {
		const group = new Group();
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		expect(() => group.remove(circle)).not.toThrow();
		expect(group.toString()).toBe("<g/>");
	});

	it("should only remove the specified shape, leaving others intact", () => {
		const group = new Group();
		const circle = new Circle({ cx: 10, cy: 10, r: 5 });
		const rect = new Rect({ x: 0, y: 0, width: 100, height: 50 });
		group.add(circle);
		group.add(rect);
		group.remove(circle);
		const output = group.toString();
		expect(output).not.toContain("<circle");
		expect(output).toContain("<rect");
	});

	it("should return this for chaining", () => {
		const group = new Group();
		const circle = new Circle();
		group.add(circle);
		const result = group.remove(circle);
		expect(result).toBe(group);
	});
});

describe("Group.clear", () => {
	it("should remove all child shapes from the group", () => {
		const group = new Group();
		group.add(new Circle({ cx: 10, cy: 10, r: 5 }));
		group.add(new Rect({ x: 0, y: 0, width: 100, height: 50 }));
		group.clear();
		expect(group.toString()).toBe("<g/>");
	});

	it("should be a no-op on a group with no children", () => {
		const group = new Group();
		expect(() => group.clear()).not.toThrow();
		expect(group.toString()).toBe("<g/>");
	});

	it("should return this for chaining", () => {
		const group = new Group();
		const result = group.clear();
		expect(result).toBe(group);
	});

	it("should allow adding shapes again after clear", () => {
		const group = new Group();
		group.add(new Circle({ r: 10 }));
		group.clear();
		group.add(new Rect({ x: 0, y: 0, width: 50, height: 50 }));
		const output = group.toString();
		expect(output).not.toContain("<circle");
		expect(output).toContain("<rect");
	});
});
