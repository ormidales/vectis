import { describe, expect, it } from "vitest";
import { SvgCanvas } from "../src/index.js";

describe("SvgCanvas", () => {
	it("should generate an svg element with default attributes", () => {
		const canvas = new SvgCanvas();
		const output = canvas.toString();

		expect(output).toContain("<svg");
		expect(output).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(output).toContain('viewBox="0 0 300 150"');
		expect(output).toContain('width="300"');
		expect(output).toContain('height="150"');
		expect(output).toContain("</svg>");
	});

	it("should accept custom width and height", () => {
		const canvas = new SvgCanvas({ width: 800, height: 600 });
		const output = canvas.toString();

		expect(output).toContain('width="800"');
		expect(output).toContain('height="600"');
		expect(output).toContain('viewBox="0 0 800 600"');
	});

	it("should accept a custom viewBox", () => {
		const canvas = new SvgCanvas({ viewBox: "0 0 100 100" });
		const output = canvas.toString();

		expect(output).toContain('viewBox="0 0 100 100"');
	});

	it("should return a valid SVG string", () => {
		const canvas = new SvgCanvas({ width: 500, height: 400 });
		const output = canvas.toString();

		expect(output).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400"></svg>',
		);
	});
});
