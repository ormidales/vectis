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

		it("should clamp +Infinity rx to 0", () => {
			const ellipse = new Ellipse({ rx: Number.POSITIVE_INFINITY });
			expect(ellipse.getRx()).toBe(0);
		});

		it("should clamp -Infinity rx to 0", () => {
			const ellipse = new Ellipse({ rx: Number.NEGATIVE_INFINITY });
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

		it("should clamp +Infinity ry to 0", () => {
			const ellipse = new Ellipse({ ry: Number.POSITIVE_INFINITY });
			expect(ellipse.getRy()).toBe(0);
		});

		it("should clamp -Infinity ry to 0", () => {
			const ellipse = new Ellipse({ ry: Number.NEGATIVE_INFINITY });
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

		it("should not emit +Infinity rx in SVG output", () => {
			const output = new Ellipse({ rx: Number.POSITIVE_INFINITY, ry: 25 }).toString();
			expect(output).toContain('rx="0"');
			expect(output).not.toContain("Infinity");
		});

		it("should not emit -Infinity rx in SVG output", () => {
			const output = new Ellipse({ rx: Number.NEGATIVE_INFINITY, ry: 25 }).toString();
			expect(output).toContain('rx="0"');
			expect(output).not.toContain("Infinity");
		});
	});
});

describe("Ellipse edge cases for attribute rendering", () => {
	describe("strokeWidth attribute", () => {
		it("should render strokeWidth: 0 correctly", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, strokeWidth: 0 });
			const output = ellipse.toString();

			expect(output).toContain('stroke-width="0"');
		});

		it("should not render strokeWidth when it is NaN", () => {
			const invalidCalc = 0 / 0; // NaN
			const ellipse = new Ellipse({ rx: 10, ry: 5, strokeWidth: invalidCalc });
			const output = ellipse.toString();

			expect(output).not.toContain("stroke-width");
		});

		it("should not render strokeWidth when it is undefined", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, strokeWidth: undefined });
			const output = ellipse.toString();

			expect(output).not.toContain("stroke-width");
		});
	});

	describe("opacity attribute", () => {
		it("should render opacity: 0 correctly", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, opacity: 0 });
			const output = ellipse.toString();

			expect(output).toContain('opacity="0"');
		});

		it("should not render opacity when it is NaN", () => {
			const invalidCalc = 0 / 0; // NaN
			const ellipse = new Ellipse({ rx: 10, ry: 5, opacity: invalidCalc });
			const output = ellipse.toString();

			expect(output).not.toContain("opacity");
		});

		it("should render opacity with decimal values", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, opacity: 0.5 });
			const output = ellipse.toString();

			expect(output).toContain('opacity="0.5"');
		});
	});

	describe("string attributes", () => {
		it("should not render fill when it is an empty string", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, fill: "" });
			const output = ellipse.toString();

			expect(output).not.toContain('fill=""');
			expect(output).not.toContain("fill");
		});

		it("should not render stroke when it is an empty string", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, stroke: "" });
			const output = ellipse.toString();

			expect(output).not.toContain('stroke=""');
			expect(output).not.toContain("stroke");
		});

		it("should render fill with valid string value", () => {
			const ellipse = new Ellipse({ rx: 10, ry: 5, fill: "blue" });
			const output = ellipse.toString();

			expect(output).toContain('fill="blue"');
		});
	});

	describe("null values", () => {
		it("should not render attributes when they are explicitly null", () => {
			const ellipse = new Ellipse({
				rx: 10,
				ry: 5,
				fill: null as unknown as string,
				stroke: null as unknown as string,
				strokeWidth: null as unknown as number,
				opacity: null as unknown as number,
			});
			const output = ellipse.toString();

			expect(output).not.toContain("fill");
			expect(output).not.toContain("stroke");
			expect(output).not.toContain("stroke-width");
			expect(output).not.toContain("opacity");
			expect(output).toBe('<ellipse cx="0" cy="0" rx="10" ry="5"/>');
		});
	});
});
