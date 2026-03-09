import { describe, expect, it } from "vitest";
import { Ellipse } from "../src/index.js";

describe("Ellipse edge cases for rx / ry clamping", () => {
	describe("rx clamping", () => {
		it("should clamp negative rx to 0", () => {
			const ellipse = new Ellipse({ rx: -10 });
			expect(ellipse.getRx()).toBe(0);
		});

		it("should clamp NaN rx to 0", () => {
			const ellipse = new Ellipse({ rx: Number.NaN });
			expect(ellipse.getRx()).toBe(0);
		});

		it("should clamp Infinity rx to 0", () => {
			const ellipse = new Ellipse({ rx: Number.POSITIVE_INFINITY });
			expect(ellipse.getRx()).toBe(0);
		});

		it("should keep a valid positive rx unchanged", () => {
			const ellipse = new Ellipse({ rx: 40 });
			expect(ellipse.getRx()).toBe(40);
		});

		it("should keep rx of 0 as 0", () => {
			const ellipse = new Ellipse({ rx: 0 });
			expect(ellipse.getRx()).toBe(0);
		});
	});

	describe("ry clamping", () => {
		it("should clamp negative ry to 0", () => {
			const ellipse = new Ellipse({ ry: -5 });
			expect(ellipse.getRy()).toBe(0);
		});

		it("should clamp NaN ry to 0", () => {
			const ellipse = new Ellipse({ ry: Number.NaN });
			expect(ellipse.getRy()).toBe(0);
		});

		it("should clamp Infinity ry to 0", () => {
			const ellipse = new Ellipse({ ry: Number.POSITIVE_INFINITY });
			expect(ellipse.getRy()).toBe(0);
		});

		it("should keep a valid positive ry unchanged", () => {
			const ellipse = new Ellipse({ ry: 25 });
			expect(ellipse.getRy()).toBe(25);
		});

		it("should keep ry of 0 as 0", () => {
			const ellipse = new Ellipse({ ry: 0 });
			expect(ellipse.getRy()).toBe(0);
		});
	});

	describe("SVG output with clamped values", () => {
		it("should not emit negative rx in SVG output", () => {
			const output = new Ellipse({ rx: -10, ry: 25 }).toString();
			expect(output).toContain('rx="0"');
		});

		it("should not emit NaN rx in SVG output", () => {
			const output = new Ellipse({ rx: Number.NaN, ry: 25 }).toString();
			expect(output).toContain('rx="0"');
			expect(output).not.toContain("NaN");
		});

		it("should not emit Infinity rx in SVG output", () => {
			const output = new Ellipse({ rx: Number.POSITIVE_INFINITY, ry: 25 }).toString();
			expect(output).toContain('rx="0"');
			expect(output).not.toContain("Infinity");
		});
	});
});
