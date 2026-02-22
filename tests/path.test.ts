import { describe, expect, it } from "vitest";
import { Path } from "../src/index.js";

describe("Path", () => {
	it("should generate a path element with default attributes", () => {
		const path = new Path();
		const output = path.toString();

		expect(output).toBe('<path d=""/>');
	});

	it("should accept a custom d attribute", () => {
		const path = new Path({ d: "M 10 10 L 90 90" });
		const output = path.toString();

		expect(output).toBe('<path d="M 10 10 L 90 90"/>');
	});

	it("should include fill attribute when specified", () => {
		const path = new Path({ d: "M 0 0", fill: "none" });
		const output = path.toString();

		expect(output).toContain('fill="none"');
	});

	it("should include stroke attribute when specified", () => {
		const path = new Path({ d: "M 0 0", stroke: "red" });
		const output = path.toString();

		expect(output).toContain('stroke="red"');
	});

	it("should include both fill and stroke when specified", () => {
		const path = new Path({ d: "M 0 0 L 100 100", fill: "none", stroke: "red" });
		const output = path.toString();

		expect(output).toBe('<path d="M 0 0 L 100 100" fill="none" stroke="red"/>');
	});

	it("should escape special characters in d to prevent XSS", () => {
		const path = new Path({ d: 'M 0 0" onload="alert(1)' });
		const output = path.toString();

		expect(output).not.toContain('"M 0 0" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const path = new Path({ d: "M 0 0", fill: '<script>alert(1)</script>' });
		const output = path.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const path = new Path({ d: "M 0 0", stroke: "red", strokeWidth: 2 });
		const output = path.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const path = new Path({ d: "M 0 0", opacity: 0.5 });
		const output = path.toString();

		expect(output).toContain('opacity="0.5"');
	});
});
