import { describe, expect, it } from "vitest";
import { Rect } from "../src/index.js";

describe("Rect", () => {
	it("should generate a rect element with default attributes", () => {
		const rect = new Rect();
		const output = rect.toString();

		expect(output).toBe('<rect x="0" y="0" width="0" height="0"/>');
	});

	it("should accept custom x, y, width, and height", () => {
		const rect = new Rect({ x: 10, y: 20, width: 100, height: 50 });
		const output = rect.toString();

		expect(output).toBe('<rect x="10" y="20" width="100" height="50"/>');
	});

	it("should include fill attribute when specified", () => {
		const rect = new Rect({ width: 100, height: 50, fill: "green" });
		const output = rect.toString();

		expect(output).toContain('fill="green"');
	});

	it("should include stroke attribute when specified", () => {
		const rect = new Rect({ width: 100, height: 50, stroke: "black" });
		const output = rect.toString();

		expect(output).toContain('stroke="black"');
	});

	it("should include both fill and stroke when specified", () => {
		const rect = new Rect({ x: 5, y: 5, width: 100, height: 50, fill: "green", stroke: "black" });
		const output = rect.toString();

		expect(output).toBe('<rect x="5" y="5" width="100" height="50" fill="green" stroke="black"/>');
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const rect = new Rect({ width: 100, height: 50, fill: 'green" onload="alert(1)' });
		const output = rect.toString();

		expect(output).not.toContain('"green" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in stroke to prevent XSS", () => {
		const rect = new Rect({ width: 100, height: 50, stroke: '<script>alert(1)</script>' });
		const output = rect.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const rect = new Rect({ width: 100, height: 50, stroke: "black", strokeWidth: 2 });
		const output = rect.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const rect = new Rect({ width: 100, height: 50, opacity: 0.5 });
		const output = rect.toString();

		expect(output).toContain('opacity="0.5"');
	});
});
