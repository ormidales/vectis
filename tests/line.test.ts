import { describe, expect, it } from "vitest";
import { Line } from "../src/index.js";

describe("Line", () => {
	it("should generate a line element with default attributes", () => {
		const line = new Line();
		const output = line.toString();

		expect(output).toBe('<line x1="0" y1="0" x2="0" y2="0"/>');
	});

	it("should accept custom x1, y1, x2, and y2", () => {
		const line = new Line({ x1: 10, y1: 10, x2: 90, y2: 90 });
		const output = line.toString();

		expect(output).toBe('<line x1="10" y1="10" x2="90" y2="90"/>');
	});

	it("should include id attribute when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, id: "my-line" });
		const output = line.toString();

		expect(output).toContain('id="my-line"');
	});

	it("should escape special characters in id to prevent XSS", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, id: '<script>alert(1)</script>' });
		const output = line.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include class attribute when className is specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, className: "connector" });
		const output = line.toString();

		expect(output).toContain('class="connector"');
	});

	it("should escape special characters in className to prevent XSS", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, className: '<script>alert(1)</script>' });
		const output = line.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include fill attribute when specified", () => {
		const line = new Line({ x1: 10, y1: 10, x2: 90, y2: 90, fill: "red" });
		const output = line.toString();

		expect(output).toContain('fill="red"');
	});

	it("should include stroke attribute when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, stroke: "blue" });
		const output = line.toString();

		expect(output).toContain('stroke="blue"');
	});

	it("should include both fill and stroke when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, fill: "red", stroke: "blue" });
		const output = line.toString();

		expect(output).toBe('<line x1="0" y1="0" x2="100" y2="100" fill="red" stroke="blue"/>');
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, fill: 'red" onload="alert(1)' });
		const output = line.toString();

		expect(output).not.toContain('"red" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in stroke to prevent XSS", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, stroke: '<script>alert(1)</script>' });
		const output = line.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, stroke: "blue", strokeWidth: 2 });
		const output = line.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, opacity: 0.5 });
		const output = line.toString();

		expect(output).toContain('opacity="0.5"');
	});

	it("should include transform attribute when specified", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, transform: "rotate(45)" });
		const output = line.toString();

		expect(output).toContain('transform="rotate(45)"');
	});

	it("should support translate transform", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, transform: "translate(100 50)" });
		const output = line.toString();

		expect(output).toContain('transform="translate(100 50)"');
	});

	it("should support combined transforms", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, transform: "translate(50 50) rotate(45)" });
		const output = line.toString();

		expect(output).toContain('transform="translate(50 50) rotate(45)"');
	});

	it("should escape special characters in transform to prevent XSS", () => {
		const line = new Line({ x1: 0, y1: 0, x2: 100, y2: 100, transform: '<script>alert(1)</script>' });
		const output = line.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	describe("getter methods", () => {
		it("should return x1 value via getX1()", () => {
			const line = new Line({ x1: 10, y1: 20, x2: 90, y2: 80 });
			expect(line.getX1()).toBe(10);
		});

		it("should return y1 value via getY1()", () => {
			const line = new Line({ x1: 10, y1: 20, x2: 90, y2: 80 });
			expect(line.getY1()).toBe(20);
		});

		it("should return x2 value via getX2()", () => {
			const line = new Line({ x1: 10, y1: 20, x2: 90, y2: 80 });
			expect(line.getX2()).toBe(90);
		});

		it("should return y2 value via getY2()", () => {
			const line = new Line({ x1: 10, y1: 20, x2: 90, y2: 80 });
			expect(line.getY2()).toBe(80);
		});

		it("should return default values when not specified", () => {
			const line = new Line();
			expect(line.getX1()).toBe(0);
			expect(line.getY1()).toBe(0);
			expect(line.getX2()).toBe(0);
			expect(line.getY2()).toBe(0);
		});

		it("should return correct values after construction", () => {
			const line = new Line({ x1: 5, y1: 15, x2: 100, y2: 200 });
			expect(line.getX1()).toBe(5);
			expect(line.getY1()).toBe(15);
			expect(line.getX2()).toBe(100);
			expect(line.getY2()).toBe(200);
		});
	});
});
