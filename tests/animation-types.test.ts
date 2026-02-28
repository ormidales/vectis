import { describe, expect, it } from "vitest";
import { Circle } from "../src/shapes/circle.js";
import type {
	AnimationValue,
	ColorValue,
	NumericValue,
	RotateValue,
	ScaleValue,
	SkewXValue,
	SkewYValue,
	TranslateValue,
} from "../src/animation/smil.js";

describe("SMIL Animation Type Safety", () => {
	describe("NumericValue animations", () => {
		it("should accept numeric string values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "25",
				to: "50",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="25"');
			expect(output).toContain('to="50"');
		});

		it("should accept percentage values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "opacity",
				from: "0%",
				to: "100%",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="0%"');
			expect(output).toContain('to="100%"');
		});

		it("should accept CSS unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10px",
				to: "20px",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10px"');
			expect(output).toContain('to="20px"');
		});

		it("should accept pt unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10pt",
				to: "20pt",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10pt"');
			expect(output).toContain('to="20pt"');
		});

		it("should accept vw unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10vw",
				to: "50vw",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10vw"');
			expect(output).toContain('to="50vw"');
		});

		it("should accept vh unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10vh",
				to: "50vh",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10vh"');
			expect(output).toContain('to="50vh"');
		});

		it("should accept vmin unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10vmin",
				to: "50vmin",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10vmin"');
			expect(output).toContain('to="50vmin"');
		});

		it("should accept vmax unit values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "10vmax",
				to: "50vmax",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="10vmax"');
			expect(output).toContain('to="50vmax"');
		});
	});

	describe("ColorValue animations", () => {
		it("should accept hex color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "#ff0000",
				to: "#00ff00",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="#ff0000"');
			expect(output).toContain('to="#00ff00"');
		});

		it("should accept named color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "red",
				to: "blue",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="red"');
			expect(output).toContain('to="blue"');
		});

		it("should accept rgb color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "rgb(255, 0, 0)",
				to: "rgb(0, 255, 0)",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="rgb(255, 0, 0)"');
			expect(output).toContain('to="rgb(0, 255, 0)"');
		});

		it("should accept rgba color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "rgba(255, 0, 0, 0.5)",
				to: "rgba(0, 255, 0, 1)",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="rgba(255, 0, 0, 0.5)"');
			expect(output).toContain('to="rgba(0, 255, 0, 1)"');
		});

		it("should accept hsl color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "hsl(120, 100%, 50%)",
				to: "hsl(240, 100%, 50%)",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="hsl(120, 100%, 50%)"');
			expect(output).toContain('to="hsl(240, 100%, 50%)"');
		});

		it("should accept hsla color values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "hsla(120, 100%, 50%, 0.5)",
				to: "hsla(240, 100%, 50%, 1)",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="hsla(120, 100%, 50%, 0.5)"');
			expect(output).toContain('to="hsla(240, 100%, 50%, 1)"');
		});

		it("should accept transparent color", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				from: "transparent",
				to: "#ff0000",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="transparent"');
			expect(output).toContain('to="#ff0000"');
		});
	});

	describe("TransformValue animations", () => {
		it("should accept translate transform values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				type: "translate",
				from: "0 0",
				to: "100 100",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="0 0"');
			expect(output).toContain('to="100 100"');
		});

		it("should accept rotate transform values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				type: "rotate",
				from: "0 50 50",
				to: "360 50 50",
				dur: "2s",
			});
			const output = circle.toString();

			expect(output).toContain('from="0 50 50"');
			expect(output).toContain('to="360 50 50"');
		});

		it("should accept scale transform values", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				type: "scale",
				from: "1 1",
				to: "2 2",
				dur: "1s",
			});
			const output = circle.toString();

			expect(output).toContain('from="1 1"');
			expect(output).toContain('to="2 2"');
		});
	});

	describe("values attribute with multiple keyframes", () => {
		it("should accept numeric values list", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				values: "25;50;25",
				keyTimes: "0;0.5;1",
				dur: "2s",
			});
			const output = circle.toString();

			expect(output).toContain('values="25;50;25"');
			expect(output).toContain('keyTimes="0;0.5;1"');
		});

		it("should accept color values list", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "fill",
				values: "#ff0000;#00ff00;#0000ff;#ff0000",
				keyTimes: "0;0.33;0.66;1",
				dur: "3s",
			});
			const output = circle.toString();

			expect(output).toContain('values="#ff0000;#00ff00;#0000ff;#ff0000"');
			expect(output).toContain('keyTimes="0;0.33;0.66;1"');
		});

		it("should accept transform values list", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				type: "translate",
				values: "0 0;50 50;100 100",
				keyTimes: "0;0.5;1",
				dur: "2s",
			});
			const output = circle.toString();

			expect(output).toContain('values="0 0;50 50;100 100"');
			expect(output).toContain('keyTimes="0;0.5;1"');
		});
	});

	describe("fill attribute type safety", () => {
		it("should accept 'freeze' value", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "25",
				to: "50",
				dur: "1s",
				fill: "freeze",
			});
			const output = circle.toString();

			expect(output).toContain('fill="freeze"');
		});

		it("should accept 'remove' value", () => {
			const circle = new Circle({ cx: 50, cy: 50, r: 25 });
			circle.animate({
				attributeName: "r",
				from: "25",
				to: "50",
				dur: "1s",
				fill: "remove",
			});
			const output = circle.toString();

			expect(output).toContain('fill="remove"');
		});
	});

	describe("Type utilities are exported and usable", () => {
		it("should allow using NumericValue type", () => {
			const numValue: NumericValue = "50";
			expect(typeof numValue).toBe("string");

			const percentValue: NumericValue = "50%";
			expect(percentValue).toBe("50%");

			const pxValue: NumericValue = "10px";
			expect(pxValue).toBe("10px");
		});

		it("should allow using ColorValue type", () => {
			const hexColor: ColorValue = "#ff0000";
			expect(hexColor).toBe("#ff0000");

			const namedColor: ColorValue = "red";
			expect(namedColor).toBe("red");

			const rgbColor: ColorValue = "rgb(255, 0, 0)";
			expect(rgbColor).toBe("rgb(255, 0, 0)");

			const transparentColor: ColorValue = "transparent";
			expect(transparentColor).toBe("transparent");
		});

		it("should allow using AnimationValue type", () => {
			const numericAnimation: AnimationValue = "50";
			const colorAnimation: AnimationValue = "#ff0000";
			const transformAnimation: AnimationValue = "0 0";

			expect(numericAnimation).toBe("50");
			expect(colorAnimation).toBe("#ff0000");
			expect(transformAnimation).toBe("0 0");
		});

		it("should allow using TranslateValue type", () => {
			const translateTwoParams: TranslateValue = "50 100";
			expect(translateTwoParams).toBe("50 100");

			const translateOneParam: TranslateValue = "50";
			expect(translateOneParam).toBe("50");
		});

		it("should allow using ScaleValue type", () => {
			const scaleTwoParams: ScaleValue = "2 1.5";
			expect(scaleTwoParams).toBe("2 1.5");

			const scaleOneParam: ScaleValue = "2";
			expect(scaleOneParam).toBe("2");
		});

		it("should allow using RotateValue type", () => {
			const rotateThreeParams: RotateValue = "45 50 50";
			expect(rotateThreeParams).toBe("45 50 50");

			const rotateOneParam: RotateValue = "45";
			expect(rotateOneParam).toBe("45");
		});

		it("should allow using SkewXValue type", () => {
			const skewX: SkewXValue = "30";
			expect(skewX).toBe("30");
		});

		it("should allow using SkewYValue type", () => {
			const skewY: SkewYValue = "30";
			expect(skewY).toBe("30");
		});
	});
});
