import { describe, expect, it } from "vitest";
import { Circle, Rect, SvgCanvas } from "../src/index.js";

describe("SvgCanvas.add", () => {
	it("should add a shape and include it in the output", () => {
		const canvas = new SvgCanvas({ width: 100, height: 100 });
		canvas.add(new Circle({ cx: 50, cy: 50, r: 25 }));
		const output = canvas.toString();

		expect(output).toContain('<circle cx="50" cy="50" r="25"/>');
		expect(output).toContain("<svg");
		expect(output).toContain("</svg>");
	});

	it("should add multiple shapes", () => {
		const canvas = new SvgCanvas({ width: 200, height: 200 });
		canvas.add(new Circle({ cx: 50, cy: 50, r: 25 }));
		canvas.add(new Rect({ x: 10, y: 10, width: 80, height: 80 }));
		const output = canvas.toString();

		expect(output).toContain('<circle cx="50" cy="50" r="25"/>');
		expect(output).toContain('<rect x="10" y="10" width="80" height="80"/>');
	});

	it("should return this for chaining", () => {
		const canvas = new SvgCanvas();
		const result = canvas.add(new Circle());

		expect(result).toBe(canvas);
	});

	it("should produce empty svg when no shapes are added", () => {
		const canvas = new SvgCanvas({ width: 500, height: 400 });
		const output = canvas.toString();

		expect(output).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400"></svg>',
		);
	});
});
