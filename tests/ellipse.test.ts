import { describe, expect, it } from "vitest";
import { Ellipse } from "../src/index.js";

describe("Ellipse", () => {
	it("should generate an ellipse element with default attributes", () => {
		const ellipse = new Ellipse();
		const output = ellipse.toString();

		expect(output).toBe('<ellipse cx="0" cy="0" rx="0" ry="0"/>');
	});

	it("should accept custom cx, cy, rx, and ry", () => {
		const ellipse = new Ellipse({ cx: 50, cy: 50, rx: 40, ry: 25 });
		const output = ellipse.toString();

		expect(output).toBe('<ellipse cx="50" cy="50" rx="40" ry="25"/>');
	});

	it("should include id attribute when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, id: "my-ellipse" });
		const output = ellipse.toString();

		expect(output).toContain('id="my-ellipse"');
	});

	it("should escape special characters in id to prevent XSS", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, id: '<script>alert(1)</script>' });
		const output = ellipse.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include class attribute when className is specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, className: "icon" });
		const output = ellipse.toString();

		expect(output).toContain('class="icon"');
	});

	it("should escape special characters in className to prevent XSS", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, className: '<script>alert(1)</script>' });
		const output = ellipse.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include fill attribute when specified", () => {
		const ellipse = new Ellipse({ cx: 10, cy: 10, rx: 5, ry: 3, fill: "red" });
		const output = ellipse.toString();

		expect(output).toContain('fill="red"');
	});

	it("should include stroke attribute when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, stroke: "blue" });
		const output = ellipse.toString();

		expect(output).toContain('stroke="blue"');
	});

	it("should include both fill and stroke when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, fill: "red", stroke: "blue" });
		const output = ellipse.toString();

		expect(output).toBe('<ellipse cx="0" cy="0" rx="10" ry="5" fill="red" stroke="blue"/>');
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, fill: 'red" onload="alert(1)' });
		const output = ellipse.toString();

		expect(output).not.toContain('"red" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in stroke to prevent XSS", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, stroke: '<script>alert(1)</script>' });
		const output = ellipse.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, stroke: "blue", strokeWidth: 2 });
		const output = ellipse.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, opacity: 0.5 });
		const output = ellipse.toString();

		expect(output).toContain('opacity="0.5"');
	});

	it("should include transform attribute when specified", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, transform: "rotate(45)" });
		const output = ellipse.toString();

		expect(output).toContain('transform="rotate(45)"');
	});

	it("should support translate transform", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, transform: "translate(100 50)" });
		const output = ellipse.toString();

		expect(output).toContain('transform="translate(100 50)"');
	});

	it("should support combined transforms", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, transform: "translate(50 50) rotate(45)" });
		const output = ellipse.toString();

		expect(output).toContain('transform="translate(50 50) rotate(45)"');
	});

	it("should escape special characters in transform to prevent XSS", () => {
		const ellipse = new Ellipse({ rx: 10, ry: 5, transform: '<script>alert(1)</script>' });
		const output = ellipse.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});
});
