import { describe, expect, it } from "vitest";
import { Line } from "../src/index.js";

describe("Line edge cases for coordinate sanitization", () => {
	describe("x1 sanitization", () => {
		it("should normalise NaN x1 to 0", () => {
			const line = new Line({ x1: Number.NaN });
			expect(line.getX1()).toBe(0);
		});

		it("should normalise +Infinity x1 to 0", () => {
			const line = new Line({ x1: Number.POSITIVE_INFINITY });
			expect(line.getX1()).toBe(0);
		});

		it("should normalise -Infinity x1 to 0", () => {
			const line = new Line({ x1: Number.NEGATIVE_INFINITY });
			expect(line.getX1()).toBe(0);
		});

		it("should keep a valid positive x1 unchanged", () => {
			const line = new Line({ x1: 10 });
			expect(line.getX1()).toBe(10);
		});

		it("should keep a valid negative x1 unchanged", () => {
			const line = new Line({ x1: -10 });
			expect(line.getX1()).toBe(-10);
		});
	});

	describe("y1 sanitization", () => {
		it("should normalise NaN y1 to 0", () => {
			const line = new Line({ y1: Number.NaN });
			expect(line.getY1()).toBe(0);
		});

		it("should normalise +Infinity y1 to 0", () => {
			const line = new Line({ y1: Number.POSITIVE_INFINITY });
			expect(line.getY1()).toBe(0);
		});

		it("should normalise -Infinity y1 to 0", () => {
			const line = new Line({ y1: Number.NEGATIVE_INFINITY });
			expect(line.getY1()).toBe(0);
		});

		it("should keep a valid positive y1 unchanged", () => {
			const line = new Line({ y1: 20 });
			expect(line.getY1()).toBe(20);
		});

		it("should keep a valid negative y1 unchanged", () => {
			const line = new Line({ y1: -20 });
			expect(line.getY1()).toBe(-20);
		});
	});

	describe("x2 sanitization", () => {
		it("should normalise NaN x2 to 0", () => {
			const line = new Line({ x2: Number.NaN });
			expect(line.getX2()).toBe(0);
		});

		it("should normalise +Infinity x2 to 0", () => {
			const line = new Line({ x2: Number.POSITIVE_INFINITY });
			expect(line.getX2()).toBe(0);
		});

		it("should normalise -Infinity x2 to 0", () => {
			const line = new Line({ x2: Number.NEGATIVE_INFINITY });
			expect(line.getX2()).toBe(0);
		});

		it("should keep a valid positive x2 unchanged", () => {
			const line = new Line({ x2: 90 });
			expect(line.getX2()).toBe(90);
		});

		it("should keep a valid negative x2 unchanged", () => {
			const line = new Line({ x2: -90 });
			expect(line.getX2()).toBe(-90);
		});
	});

	describe("y2 sanitization", () => {
		it("should normalise NaN y2 to 0", () => {
			const line = new Line({ y2: Number.NaN });
			expect(line.getY2()).toBe(0);
		});

		it("should normalise +Infinity y2 to 0", () => {
			const line = new Line({ y2: Number.POSITIVE_INFINITY });
			expect(line.getY2()).toBe(0);
		});

		it("should normalise -Infinity y2 to 0", () => {
			const line = new Line({ y2: Number.NEGATIVE_INFINITY });
			expect(line.getY2()).toBe(0);
		});

		it("should keep a valid positive y2 unchanged", () => {
			const line = new Line({ y2: 80 });
			expect(line.getY2()).toBe(80);
		});

		it("should keep a valid negative y2 unchanged", () => {
			const line = new Line({ y2: -80 });
			expect(line.getY2()).toBe(-80);
		});
	});

	describe("SVG output with sanitized values", () => {
		it("should not emit NaN in SVG output", () => {
			const output = new Line({ x1: Number.NaN, y1: Number.NaN, x2: Number.NaN, y2: Number.NaN }).toString();
			expect(output).not.toContain("NaN");
			expect(output).toBe('<line x1="0" y1="0" x2="0" y2="0"/>');
		});

		it("should not emit +Infinity in SVG output", () => {
			const output = new Line({ x1: Number.POSITIVE_INFINITY, y2: Number.POSITIVE_INFINITY }).toString();
			expect(output).not.toContain("Infinity");
			expect(output).toContain('x1="0"');
			expect(output).toContain('y2="0"');
		});

		it("should not emit -Infinity in SVG output", () => {
			const output = new Line({ x2: Number.NEGATIVE_INFINITY, y1: Number.NEGATIVE_INFINITY }).toString();
			expect(output).not.toContain("Infinity");
			expect(output).toContain('x2="0"');
			expect(output).toContain('y1="0"');
		});
	});
});
