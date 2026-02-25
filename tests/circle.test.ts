import { describe, expect, it } from "vitest";
import { Circle } from "../src/index.js";

describe("Circle", () => {
	it("should generate a circle element with default attributes", () => {
		const circle = new Circle();
		const output = circle.toString();

		expect(output).toBe('<circle cx="0" cy="0" r="0"/>');
	});

	it("should accept custom cx, cy, and r", () => {
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		const output = circle.toString();

		expect(output).toBe('<circle cx="50" cy="50" r="25"/>');
	});

	it("should include id attribute when specified", () => {
		const circle = new Circle({ r: 10, id: "my-circle" });
		const output = circle.toString();

		expect(output).toContain('id="my-circle"');
	});

	it("should escape special characters in id to prevent XSS", () => {
		const circle = new Circle({ r: 10, id: '<script>alert(1)</script>' });
		const output = circle.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include class attribute when className is specified", () => {
		const circle = new Circle({ r: 10, className: "icon" });
		const output = circle.toString();

		expect(output).toContain('class="icon"');
	});

	it("should escape special characters in className to prevent XSS", () => {
		const circle = new Circle({ r: 10, className: '<script>alert(1)</script>' });
		const output = circle.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include fill attribute when specified", () => {
		const circle = new Circle({ cx: 10, cy: 10, r: 5, fill: "red" });
		const output = circle.toString();

		expect(output).toContain('fill="red"');
	});

	it("should include stroke attribute when specified", () => {
		const circle = new Circle({ r: 10, stroke: "blue" });
		const output = circle.toString();

		expect(output).toContain('stroke="blue"');
	});

	it("should include both fill and stroke when specified", () => {
		const circle = new Circle({ r: 10, fill: "red", stroke: "blue" });
		const output = circle.toString();

		expect(output).toBe('<circle cx="0" cy="0" r="10" fill="red" stroke="blue"/>');
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const circle = new Circle({ r: 10, fill: 'red" onload="alert(1)' });
		const output = circle.toString();

		expect(output).not.toContain('"red" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in stroke to prevent XSS", () => {
		const circle = new Circle({ r: 10, stroke: '<script>alert(1)</script>' });
		const output = circle.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const circle = new Circle({ r: 10, stroke: "blue", strokeWidth: 2 });
		const output = circle.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include stroke-linecap attribute when specified", () => {
		const circle = new Circle({ r: 10, strokeLinecap: "round" });
		const output = circle.toString();

		expect(output).toContain('stroke-linecap="round"');
	});

	it("should include stroke-linejoin attribute when specified", () => {
		const circle = new Circle({ r: 10, strokeLinejoin: "bevel" });
		const output = circle.toString();

		expect(output).toContain('stroke-linejoin="bevel"');
	});

	it("should include both stroke-linecap and stroke-linejoin when specified", () => {
		const circle = new Circle({ r: 10, stroke: "black", strokeLinecap: "square", strokeLinejoin: "miter" });
		const output = circle.toString();

		expect(output).toContain('stroke-linecap="square"');
		expect(output).toContain('stroke-linejoin="miter"');
	});

	it("should include opacity attribute when specified", () => {
		const circle = new Circle({ r: 10, opacity: 0.5 });
		const output = circle.toString();

		expect(output).toContain('opacity="0.5"');
	});
});
