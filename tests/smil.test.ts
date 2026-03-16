import { describe, expect, it, vi } from "vitest";
import {
	Circle,
	Path,
	Polygon,
	Rect,
	validateAnimationAttributeName,
	validateSmilBegin,
	validateSmilTime,
} from "../src/index.js";

describe("validateSmilTime and validateSmilBegin public exports", () => {
	it("should export validateSmilTime from the main entry point", () => {
		expect(validateSmilTime).toBeDefined();
		expect(typeof validateSmilTime).toBe("function");
	});

	it("should export validateSmilBegin from the main entry point", () => {
		expect(validateSmilBegin).toBeDefined();
		expect(typeof validateSmilBegin).toBe("function");
	});

	it("should export validateAnimationAttributeName from the main entry point", () => {
		expect(validateAnimationAttributeName).toBeDefined();
		expect(typeof validateAnimationAttributeName).toBe("function");
	});
});

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

	it("should include a space before self-closing /> in <animate> tag", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r" });
		const output = circle.toString();

		expect(output).toMatch(/<animate\b[^>]* \/>/);
	});

	it("should include a space before self-closing /> in <animateTransform> tag", () => {
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({ type: "translate" });
		const output = rect.toString();

		expect(output).toMatch(/<animateTransform\b[^>]* \/>/);
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

	it("should escape special characters in animation attribute values", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			from: '10" onload="alert(1)',
			to: "20",
			dur: "1s",
		});
		const output = circle.toString();

		expect(output).not.toContain('"10" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in animateTransform type", () => {
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({
			type: "translate",
			to: "<script>alert(1)</script>",
			dur: "1s",
		});
		const output = rect.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should not have double spaces when some attributes are omitted", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			from: "10",
			dur: "1s",
			// Note: 'to', 'begin', 'repeatCount', 'values', 'keyTimes', 'fill' are omitted
		});
		const output = circle.toString();

		// Should not contain double spaces
		expect(output).not.toMatch(/ {2,}/);
	});

	it("should normalize spacing in animateTransform with sparse attributes", () => {
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({
			type: "translate",
			from: "0 0",
			dur: "2s",
			// Note: 'to', 'begin', etc. are omitted
		});
		const output = rect.toString();

		// Should not contain double spaces
		expect(output).not.toMatch(/ {2,}/);
	});

	it("should normalize spacing when only minimal attributes are provided", () => {
		const circle = new Circle({ r: 10 });
		circle.animate({
			attributeName: "r",
			dur: "1s",
		});
		const output = circle.toString();

		// Should not contain double spaces
		expect(output).not.toMatch(/ {2,}/);
	});
});

describe("clearAnimations", () => {
	it("should remove all animations from a shape", () => {
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		circle.animate({ attributeName: "r", from: "25", to: "50", dur: "1s" });
		circle.animate({ attributeName: "cx", from: "50", to: "100", dur: "2s" });

		const withAnimations = circle.toString();
		expect(withAnimations).toContain("<animate");

		circle.clearAnimations();
		const withoutAnimations = circle.toString();
		expect(withoutAnimations).not.toContain("<animate");
		expect(withoutAnimations).toBe('<circle cx="50" cy="50" r="25"/>');
	});

	it("should be chainable", () => {
		const circle = new Circle({ cx: 0, cy: 0, r: 10 });
		const result = circle.clearAnimations();
		expect(result).toBe(circle);
	});

	it("should allow adding animations after clearing", () => {
		const circle = new Circle({ r: 25 });
		circle.animate({ attributeName: "r", from: "25", to: "50", dur: "1s" });
		circle.clearAnimations();
		circle.animate({ attributeName: "r", from: "25", to: "75", dur: "2s" });

		const output = circle.toString();
		expect(output).toContain("<animate");
		expect(output).toContain('to="75"');
		expect(output).not.toContain('to="50"');
	});

	it("should handle multiple clear operations", () => {
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({ attributeName: "width", from: "100", to: "200", dur: "1s" });
		rect.clearAnimations();
		rect.clearAnimations();

		const output = rect.toString();
		expect(output).not.toContain("<animate");
		expect(output).toBe('<rect x="0" y="0" width="100" height="50"/>');
	});

	it("should work when called on a shape with no animations", () => {
		const circle = new Circle({ cx: 50, cy: 50, r: 25 });
		circle.clearAnimations();

		const output = circle.toString();
		expect(output).toBe('<circle cx="50" cy="50" r="25"/>');
	});

	it("should work with different shape types", () => {
		const polygon = new Polygon({ points: "0,0 50,0 25,50" });
		polygon.animate({ attributeName: "points", to: "0,0 100,0 50,100", dur: "1s" });
		polygon.clearAnimations();

		expect(polygon.toString()).toBe('<polygon points="0,0 50,0 25,50"/>');
	});

	it("should support method chaining with animate", () => {
		const circle = new Circle({ r: 10 });
		circle
			.animate({ attributeName: "r", from: "10", to: "20", dur: "1s" })
			.clearAnimations()
			.animate({ attributeName: "r", from: "10", to: "30", dur: "2s" });

		const output = circle.toString();
		expect(output).toContain('to="30"');
		expect(output).not.toContain('to="20"');
	});
});

describe("validateSmilTime", () => {
	it("should not warn for valid seconds value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("1s", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for valid milliseconds value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("500ms", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for valid hours value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("2h", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for valid minutes value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("30min", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for decimal seconds value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("0.5s", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for indefinite", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("indefinite", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for partial clock value mm:ss", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("01:30", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for full clock value h:mm:ss", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("1:01:30", "dur");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should warn for out-of-range clock value like 99:99", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("99:99", "dur");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"99:99"');
		warn.mockRestore();
	});

	it("should warn for a bare number without unit", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("10", "dur");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"dur"');
		expect(warn.mock.calls[0][0]).toContain('"10"');
		warn.mockRestore();
	});

	it("should warn for a wrong unit like 1sec", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("1sec", "dur");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"1sec"');
		warn.mockRestore();
	});

	it("should warn for an arbitrary invalid string", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("invalide", "dur");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"invalide"');
		warn.mockRestore();
	});

	it("should include the attribute name in the warning message", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilTime("bad", "begin");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"begin"');
		warn.mockRestore();
	});

	it("should warn when animate() receives an invalid dur value", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r", dur: "invalide" }).toString();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"dur"');
		warn.mockRestore();
	});

	it("should warn when animate() receives an invalid begin value", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r", begin: "1second" }).toString();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"1second"');
		warn.mockRestore();
	});

	it("should not warn when animate() receives a valid dur value", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r", dur: "2s" }).toString();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn when animate() receives a valid begin value", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r", begin: "0.5s" }).toString();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn when animate() receives a valid event-based begin value", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "r", begin: "click" }).toString();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should return true for a valid time value", () => {
		expect(validateSmilTime("1s")).toBe(true);
		expect(validateSmilTime("500ms")).toBe(true);
		expect(validateSmilTime("2h")).toBe(true);
		expect(validateSmilTime("30min")).toBe(true);
		expect(validateSmilTime("indefinite")).toBe(true);
		expect(validateSmilTime("01:30")).toBe(true);
		expect(validateSmilTime("1:01:30")).toBe(true);
	});

	it("should return false for an invalid time value", () => {
		expect(validateSmilTime("10")).toBe(false);
		expect(validateSmilTime("1sec")).toBe(false);
		expect(validateSmilTime("invalid")).toBe(false);
		expect(validateSmilTime("99:99")).toBe(false);
	});

	it("should return true without attrName when the value is valid", () => {
		expect(validateSmilTime("2s")).toBe(true);
	});

	it("should return false without attrName when the value is invalid", () => {
		const warn = vi.spyOn(console, "warn");
		expect(validateSmilTime("bad")).toBe(false);
		expect(warn).toHaveBeenCalledOnce();
		warn.mockRestore();
	});
});

describe("validateSmilBegin", () => {
	it("should not warn for a valid time value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("1s");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for indefinite", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("indefinite");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for a bare event name like click", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("click");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for a syncbase reference like myId.begin", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("myId.begin");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for an event reference with time offset like myId.end+1s", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("myId.end+1s");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for a semicolon-separated list of valid begin values", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("0s; click; myId.begin+500ms");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should warn for an arbitrary invalid begin value", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("1second");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain("begin");
		expect(warn.mock.calls[0][0]).toContain('"1second"');
		warn.mockRestore();
	});

	it("should warn when at least one entry in a list is invalid", () => {
		const warn = vi.spyOn(console, "warn");
		validateSmilBegin("0s; badvalue!!; click");
		expect(warn).toHaveBeenCalledOnce();
		warn.mockRestore();
	});

	it("should return true for a valid begin value", () => {
		expect(validateSmilBegin("1s")).toBe(true);
		expect(validateSmilBegin("indefinite")).toBe(true);
		expect(validateSmilBegin("click")).toBe(true);
		expect(validateSmilBegin("myId.begin")).toBe(true);
		expect(validateSmilBegin("myId.end+1s")).toBe(true);
		expect(validateSmilBegin("0s; click; myId.begin+500ms")).toBe(true);
	});

	it("should return false for an invalid begin value", () => {
		expect(validateSmilBegin("1second")).toBe(false);
		expect(validateSmilBegin("0s; badvalue!!; click")).toBe(false);
	});
});

describe("validateAnimationAttributeName", () => {
	it("should not warn for a valid animatable attribute like cx", () => {
		const warn = vi.spyOn(console, "warn");
		validateAnimationAttributeName("cx");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should not warn for a valid animatable attribute like opacity", () => {
		const warn = vi.spyOn(console, "warn");
		validateAnimationAttributeName("opacity");
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});

	it("should warn for onload", () => {
		const warn = vi.spyOn(console, "warn");
		validateAnimationAttributeName("onload");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"onload"');
		warn.mockRestore();
	});

	it("should warn for onclick", () => {
		const warn = vi.spyOn(console, "warn");
		validateAnimationAttributeName("onclick");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"onclick"');
		warn.mockRestore();
	});

	it("should warn for onmouseover passed as 'onMouseOver' (case-insensitive)", () => {
		const warn = vi.spyOn(console, "warn");
		validateAnimationAttributeName("onMouseOver");
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"onMouseOver"');
		warn.mockRestore();
	});

	it("should warn when onload is used as attributeName in animate()", () => {
		const warn = vi.spyOn(console, "warn");
		const circle = new Circle({ r: 10 });
		circle.animate({ attributeName: "onload", dur: "1s" }).toString();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"onload"');
		warn.mockRestore();
	});

	it("should warn when onclick is used as attributeName in animateTransform()", () => {
		const warn = vi.spyOn(console, "warn");
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({ type: "rotate", attributeName: "onclick", dur: "1s" }).toString();
		expect(warn).toHaveBeenCalledOnce();
		expect(warn.mock.calls[0][0]).toContain('"onclick"');
		warn.mockRestore();
	});

	it("should not warn for the default transform attributeName on animateTransform", () => {
		const warn = vi.spyOn(console, "warn");
		const rect = new Rect({ width: 100, height: 50 });
		rect.animate({ type: "rotate", dur: "1s" }).toString();
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
	});
});
