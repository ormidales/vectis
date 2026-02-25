import { describe, expect, it } from "vitest";
import { Circle, Rect, SvgCanvas } from "../src/index.js";

describe("Performance tests", () => {
	it("should efficiently generate SVG for 10,000 circles", () => {
		const canvas = new SvgCanvas({ width: 1000, height: 1000 });

		// Generate 10,000 circles with various attributes
		const startTime = performance.now();
		for (let i = 0; i < 10000; i++) {
			canvas.add(
				new Circle({
					cx: (i % 100) * 10,
					cy: Math.floor(i / 100) * 10,
					r: 5,
					fill: `rgb(${i % 255}, ${(i * 2) % 255}, ${(i * 3) % 255})`,
					stroke: "black",
					strokeWidth: 1,
					opacity: 0.5,
				}),
			);
		}
		const generationTime = performance.now() - startTime;

		// Measure toString() performance
		const toStringStartTime = performance.now();
		const svg = canvas.toString();
		const toStringTime = performance.now() - toStringStartTime;

		// Verify output is valid
		expect(svg).toContain("<svg");
		expect(svg).toContain("</svg>");
		expect(svg).toContain("<circle");

		// Log performance metrics for reference
		console.log(`Generation time for 10,000 shapes: ${generationTime.toFixed(2)}ms`);
		console.log(`toString() time for 10,000 shapes: ${toStringTime.toFixed(2)}ms`);
		console.log(`Total time: ${(generationTime + toStringTime).toFixed(2)}ms`);
		console.log(`SVG length: ${svg.length} characters`);

		// Ensure reasonable performance (should complete in under 1 second)
		expect(toStringTime).toBeLessThan(1000);
	});

	it("should efficiently generate SVG for 10,000 rectangles with animations", () => {
		const canvas = new SvgCanvas({ width: 1000, height: 1000 });

		// Generate 10,000 rectangles with animations
		const startTime = performance.now();
		for (let i = 0; i < 10000; i++) {
			canvas.add(
				new Rect({
					x: (i % 100) * 10,
					y: Math.floor(i / 100) * 10,
					width: 8,
					height: 8,
					fill: "blue",
					stroke: "red",
					strokeWidth: 1,
					opacity: 0.8,
				}).animate({
					attributeName: "opacity",
					from: "0",
					to: "1",
					dur: "1s",
					repeatCount: "indefinite",
				}),
			);
		}
		const generationTime = performance.now() - startTime;

		// Measure toString() performance
		const toStringStartTime = performance.now();
		const svg = canvas.toString();
		const toStringTime = performance.now() - toStringStartTime;

		// Verify output is valid
		expect(svg).toContain("<svg");
		expect(svg).toContain("</svg>");
		expect(svg).toContain("<rect");
		expect(svg).toContain("<animate");

		// Log performance metrics for reference
		console.log(
			`Generation time for 10,000 animated shapes: ${generationTime.toFixed(2)}ms`,
		);
		console.log(
			`toString() time for 10,000 animated shapes: ${toStringTime.toFixed(2)}ms`,
		);
		console.log(
			`Total time: ${(generationTime + toStringTime).toFixed(2)}ms`,
		);
		console.log(`SVG length: ${svg.length} characters`);

		// Ensure reasonable performance (should complete in under 2 seconds)
		expect(toStringTime).toBeLessThan(2000);
	});
});
