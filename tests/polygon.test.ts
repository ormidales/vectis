import { describe, expect, it } from "vitest";
import { Polygon } from "../src/index.js";

describe("Polygon", () => {
	it("should generate a polygon element with default attributes", () => {
		const polygon = new Polygon();
		const output = polygon.toString();

		expect(output).toBe('<polygon points=""/>');
	});

	it("should accept custom points", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50" });
		const output = polygon.toString();

		expect(output).toBe('<polygon points="0,0 50,25 25,50"/>');
	});

	it("should include fill attribute when specified", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", fill: "yellow" });
		const output = polygon.toString();

		expect(output).toContain('fill="yellow"');
	});

	it("should include stroke attribute when specified", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", stroke: "purple" });
		const output = polygon.toString();

		expect(output).toContain('stroke="purple"');
	});

	it("should include both fill and stroke when specified", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", fill: "yellow", stroke: "purple" });
		const output = polygon.toString();

		expect(output).toBe('<polygon points="0,0 50,25 25,50" fill="yellow" stroke="purple"/>');
	});

	it("should escape special characters in points to prevent XSS", () => {
		const polygon = new Polygon({ points: '0,0 50,25" onload="alert(1)' });
		const output = polygon.toString();

		expect(output).not.toContain('"0,0 50,25" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", fill: '<script>alert(1)</script>' });
		const output = polygon.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", stroke: "purple", strokeWidth: 2 });
		const output = polygon.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const polygon = new Polygon({ points: "0,0 50,25 25,50", opacity: 0.5 });
		const output = polygon.toString();

		expect(output).toContain('opacity="0.5"');
	});
});
