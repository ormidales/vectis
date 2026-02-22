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
});
