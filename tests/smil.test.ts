import { describe, expect, it } from "vitest";
import { Circle, Path, Polygon, Rect } from "../src/index.js";

describe("SMIL animate", () => {
	it("should add an <animate> tag inside a circle", () => {
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		circle.animate({ attributeName: "r", from: "25", to: "50", dur: "1s" });
		const output = circle.toString();

		expect(output).toContain("<animate");
		expect(output).toContain('attributeName="r"');
		expect(output).toContain('from="25"');
		expect(output).toContain('to="50"');
		expect(output).toContain('dur="1s"');
		expect(output).toContain("</circle>");
	});

	it("should be chainable", () => {
		const circle = new Circle({ cx: 0, cy: 0, r: 10 });
		const result = circle
			.animate({ attributeName: "cx", from: "0", to: "100", dur: "2s" })
			.animate({ attributeName: "cy", from: "0", to: "50", dur: "2s" });

		expect(result).toBe(circle);
		const output = circle.toString();
		expect(output).toContain('attributeName="cx"');
		expect(output).toContain('attributeName="cy"');
	});

	it("should generate <animateTransform> when type is provided", () => {
		const rect = new Rect({ x: 0, y: 0, width: 100, height: 50 });
		rect.animate({ type: "translate", from: "0 0", to: "100 100", dur: "2s" });
		const output = rect.toString();

		expect(output).toContain("<animateTransform");
		expect(output).toContain('attributeName="transform"');
		expect(output).toContain('type="translate"');
		expect(output).toContain("</rect>");
	});

	it("should support repeatCount attribute", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			from: "10",
			to: "20",
			dur: "1s",
			repeatCount: "indefinite",
		});
		const output = circle.toString();

		expect(output).toContain('repeatCount="indefinite"');
	});

	it("should support fill attribute on animation", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			from: "10",
			to: "20",
			dur: "1s",
			fill: "freeze",
		});
		const output = circle.toString();

		expect(output).toContain('fill="freeze"');
	});

	it("should support begin attribute", () => {
		const rect = new Rect({ width: 50, height: 50 });
		rect.animate({
			attributeName: "width",
			from: "50",
			to: "100",
			dur: "1s",
			begin: "0.5s",
		});
		const output = rect.toString();

		expect(output).toContain('begin="0.5s"');
	});

	it("should support values and keyTimes attributes", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			values: "10;20;10",
			keyTimes: "0;0.5;1",
			dur: "2s",
		});
		const output = circle.toString();

		expect(output).toContain('values="10;20;10"');
		expect(output).toContain('keyTimes="0;0.5;1"');
	});

	it("should work on Polygon shapes", () => {
		const polygon = new Polygon({ points: "0,0 50,0 25,50" });
		polygon.animate({ attributeName: "points", to: "0,0 100,0 50,100", dur: "1s" });
		const output = polygon.toString();

		expect(output).toContain("<animate");
		expect(output).toContain("</polygon>");
	});

	it("should work on Path shapes", () => {
		const path = new Path({ d: "M0 0 L100 100" });
		path.animate({ attributeName: "d", to: "M0 0 L200 200", dur: "1s" });
		const output = path.toString();

		expect(output).toContain("<animate");
		expect(output).toContain("</path>");
	});

	it("should not change output when no animations are added", () => {
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		expect(circle.toString()).toBe('<circle cx="50" cy="50" r="25"/>');
	});

	it("should support custom attributeName on animateTransform", () => {
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({
			type: "rotate",
			attributeName: "transform",
			from: "0 50 25",
			to: "360 50 25",
			dur: "3s",
			repeatCount: "indefinite",
		});
		const output = rect.toString();

		expect(output).toContain('type="rotate"');
		expect(output).toContain('attributeName="transform"');
	});
});
