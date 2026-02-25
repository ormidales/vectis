import { describe, expect, it } from "vitest";
import { Circle } from "../src/index.js";

describe("Circle edge cases for attribute rendering", () => {
	describe("strokeWidth attribute", () => {
		it("should render strokeWidth: 0 correctly", () => {
			const circle = new Circle({ r: 10, strokeWidth: 0 });
			const output = circle.toString();

			expect(output).toContain('stroke-width="0"');
		});

		it("should not render strokeWidth when it is NaN", () => {
			const invalidCalc = 0 / 0; // NaN
			const circle = new Circle({ r: 10, strokeWidth: invalidCalc });
			const output = circle.toString();

			expect(output).not.toContain("stroke-width");
		});

		it("should not render strokeWidth when it is undefined", () => {
			const circle = new Circle({ r: 10, strokeWidth: undefined });
			const output = circle.toString();

			expect(output).not.toContain("stroke-width");
		});
	});

	describe("opacity attribute", () => {
		it("should render opacity: 0 correctly", () => {
			const circle = new Circle({ r: 10, opacity: 0 });
			const output = circle.toString();

			expect(output).toContain('opacity="0"');
		});

		it("should not render opacity when it is NaN", () => {
			const invalidCalc = 0 / 0; // NaN
			const circle = new Circle({ r: 10, opacity: invalidCalc });
			const output = circle.toString();

			expect(output).not.toContain("opacity");
		});

		it("should render opacity with decimal values", () => {
			const circle = new Circle({ r: 10, opacity: 0.5 });
			const output = circle.toString();

			expect(output).toContain('opacity="0.5"');
		});
	});

	describe("string attributes", () => {
		it("should not render fill when it is an empty string", () => {
			const circle = new Circle({ r: 10, fill: "" });
			const output = circle.toString();

			expect(output).not.toContain('fill=""');
			expect(output).not.toContain("fill");
		});

		it("should not render stroke when it is an empty string", () => {
			const circle = new Circle({ r: 10, stroke: "" });
			const output = circle.toString();

			expect(output).not.toContain('stroke=""');
			expect(output).not.toContain("stroke");
		});

		it("should render fill with valid string value", () => {
			const circle = new Circle({ r: 10, fill: "red" });
			const output = circle.toString();

			expect(output).toContain('fill="red"');
		});
	});

	describe("null values", () => {
		it("should not render attributes when they are explicitly null", () => {
			const circle = new Circle({
				r: 10,
				fill: null as unknown as string,
				stroke: null as unknown as string,
				strokeWidth: null as unknown as number,
				opacity: null as unknown as number,
			});
			const output = circle.toString();

			expect(output).not.toContain("fill");
			expect(output).not.toContain("stroke");
			expect(output).not.toContain("stroke-width");
			expect(output).not.toContain("opacity");
			expect(output).toBe('<circle cx="0" cy="0" r="10"/>');
		});
	});
});
