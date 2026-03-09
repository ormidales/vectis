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

describe("SvgCanvas.remove", () => {
	it("should remove a shape that was previously added", () => {
		const canvas = new SvgCanvas({ width: 100, height: 100 });
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		canvas.add(circle);
		canvas.remove(circle);
		expect(canvas.toString()).not.toContain("<circle");
	});

	it("should be a no-op when the shape is not in the canvas", () => {
		const canvas = new SvgCanvas({ width: 100, height: 100 });
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		expect(() => canvas.remove(circle)).not.toThrow();
		expect(canvas.toString()).not.toContain("<circle");
	});

	it("should only remove the specified shape, leaving others intact", () => {
		const canvas = new SvgCanvas({ width: 200, height: 200 });
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		const rect = new Rect({ x: 10, y: 10, width: 80, height: 80 });
		canvas.add(circle);
		canvas.add(rect);
		canvas.remove(circle);
		const output = canvas.toString();
		expect(output).not.toContain("<circle");
		expect(output).toContain("<rect");
	});

	it("should return this for chaining", () => {
		const canvas = new SvgCanvas();
		const circle = new Circle();
		canvas.add(circle);
		const result = canvas.remove(circle);
		expect(result).toBe(canvas);
	});
});

describe("SvgCanvas.clear", () => {
	it("should remove all shapes from the canvas", () => {
		const canvas = new SvgCanvas({ width: 200, height: 200 });
		canvas.add(new Circle({ cx: 50, cy: 50, r: 25 }));
		canvas.add(new Rect({ x: 10, y: 10, width: 80, height: 80 }));
		canvas.clear();
		const output = canvas.toString();
		expect(output).not.toContain("<circle");
		expect(output).not.toContain("<rect");
	});

	it("should be a no-op on an already empty canvas", () => {
		const canvas = new SvgCanvas({ width: 100, height: 100 });
		expect(() => canvas.clear()).not.toThrow();
		expect(canvas.toString()).not.toContain("<circle");
	});

	it("should return this for chaining", () => {
		const canvas = new SvgCanvas();
		const result = canvas.clear();
		expect(result).toBe(canvas);
	});

	it("should allow adding shapes again after clear", () => {
		const canvas = new SvgCanvas({ width: 100, height: 100 });
		canvas.add(new Circle({ r: 10 }));
		canvas.clear();
		canvas.add(new Rect({ x: 0, y: 0, width: 50, height: 50 }));
		const output = canvas.toString();
		expect(output).not.toContain("<circle");
		expect(output).toContain("<rect");
	});
});
