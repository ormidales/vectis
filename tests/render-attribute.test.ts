import { describe, expect, it, vi } from "vitest";
import { renderAttribute } from "../src/utils/render-attribute.js";

describe("renderAttribute", () => {
	describe("valid values", () => {
		it("should render string attribute", () => {
			expect(renderAttribute("fill", "red")).toBe(' fill="red"');
		});

		it("should render numeric attribute", () => {
			expect(renderAttribute("stroke-width", 2)).toBe(' stroke-width="2"');
		});

		it("should render zero as a valid numeric value", () => {
			expect(renderAttribute("opacity", 0)).toBe(' opacity="0"');
			expect(renderAttribute("stroke-width", 0)).toBe(' stroke-width="0"');
		});

		it("should render negative numbers", () => {
			expect(renderAttribute("x", -10)).toBe(' x="-10"');
		});

		it("should render decimal numbers", () => {
			expect(renderAttribute("opacity", 0.5)).toBe(' opacity="0.5"');
		});
	});

	describe("invalid values", () => {
		it("should not render undefined", () => {
			expect(renderAttribute("fill", undefined)).toBe("");
		});

		it("should not render null", () => {
			expect(renderAttribute("fill", null)).toBe("");
		});

		it("should not render NaN", () => {
			expect(renderAttribute("opacity", Number.NaN)).toBe("");
		});

		it("should not render Infinity", () => {
			expect(renderAttribute("x", Number.POSITIVE_INFINITY)).toBe("");
			expect(renderAttribute("x", Number.NEGATIVE_INFINITY)).toBe("");
		});

		it("should not render empty string", () => {
			expect(renderAttribute("fill", "")).toBe("");
		});

		it("should not render whitespace-only strings", () => {
			expect(renderAttribute("transform", "   ")).toBe("");
			expect(renderAttribute("transform", "\t")).toBe("");
			expect(renderAttribute("transform", "\n")).toBe("");
			expect(renderAttribute("fill", "  \t\n  ")).toBe("");
		});
	});

	describe("XSS prevention", () => {
		it("should escape special characters in string values", () => {
			expect(renderAttribute("id", "<script>alert(1)</script>")).toContain(
				"&lt;script&gt;",
			);
			expect(renderAttribute("id", "<script>alert(1)</script>")).not.toContain(
				"<script>",
			);
		});

		it("should escape quotes in string values", () => {
			expect(renderAttribute("fill", 'red" onload="alert(1)')).toContain(
				"&quot;",
			);
			expect(renderAttribute("fill", 'red" onload="alert(1)')).not.toContain(
				'"red" onload="alert(1)"',
			);
		});

		it("should escape ampersands in string values", () => {
			expect(renderAttribute("id", "test&value")).toContain("&amp;");
		});

		it("should escape single quotes in string values", () => {
			expect(renderAttribute("id", "test'value")).toContain("&#39;");
		});

		it("should escape special characters in attribute keys", () => {
			expect(renderAttribute('<script>xss</script>', "value")).not.toContain(
				"<script>",
			);
			expect(renderAttribute('<script>xss</script>', "value")).toContain(
				"&lt;script&gt;",
			);
		});

		it("should escape quotes in attribute keys", () => {
			// A key containing only a quote (no whitespace) is escaped normally
			expect(renderAttribute('data-x"value', "val")).toContain("&quot;");
			expect(renderAttribute('data-x"value', "val")).not.toContain('"value"');
			// A key containing whitespace is blocked entirely (unsafe key chars guard)
			expect(renderAttribute('data-x" onload="alert(1)', "val")).toBe("");
		});

		it("should escape ampersands in attribute keys", () => {
			expect(renderAttribute("data-a&b", "val")).toContain("&amp;");
		});
	});

	describe("edge cases with dynamic calculations", () => {
		it("should handle result of invalid calculations", () => {
			const invalidCalc = 0 / 0; // NaN
			expect(renderAttribute("opacity", invalidCalc)).toBe("");
		});

		it("should handle division by zero (Infinity)", () => {
			const divByZero = 10 / 0; // Infinity
			expect(renderAttribute("width", divByZero)).toBe("");
		});

		it("should handle very small numbers", () => {
			expect(renderAttribute("opacity", 0.0001)).toBe(' opacity="0.0001"');
		});

		it("should preserve very small numbers with dynamic precision", () => {
			expect(renderAttribute("value", 1e-10)).toBe(' value="0.0000000001"');
		});

		it("should preserve sub-0.0001 values without truncating to zero", () => {
			expect(renderAttribute("x", 0.00001)).toBe(' x="0.00001"');
			expect(renderAttribute("opacity", 0.000001)).toBe(' opacity="0.000001"');
			expect(renderAttribute("x", -0.00001)).toBe(' x="-0.00001"');
		});
	});

	describe("float precision rounding", () => {
		it("should round Math.PI to 4 decimal places", () => {
			expect(renderAttribute("r", Math.PI)).toBe(' r="3.1416"');
		});

		it("should round long decimal values to 4 decimal places", () => {
			expect(renderAttribute("x", 1.2345678910111213)).toBe(' x="1.2346"');
		});

		it("should strip trailing zeros from rounded floats", () => {
			expect(renderAttribute("opacity", 0.5)).toBe(' opacity="0.5"');
			expect(renderAttribute("cx", 1.2500)).toBe(' cx="1.25"');
		});

		it("should not alter integer values", () => {
			expect(renderAttribute("width", 100)).toBe(' width="100"');
			expect(renderAttribute("x", -10)).toBe(' x="-10"');
			expect(renderAttribute("opacity", 0)).toBe(' opacity="0"');
		});

		it("should handle floats that round to an integer", () => {
			expect(renderAttribute("r", 1.00001)).toBe(' r="1"');
		});

		it("should render large-magnitude non-integers rounded to 4 decimal places with trailing zeros stripped", () => {
			// For |v| >= 1, values are rounded to 4 decimal places, then trailing zeros are stripped.
			expect(renderAttribute("x", 1234.5678)).toBe(' x="1234.5678"');
			expect(renderAttribute("x", 1000.5)).toBe(' x="1000.5"');
		});
	});

	describe("attribute key formatting", () => {
		it("should handle kebab-case attribute names", () => {
			expect(renderAttribute("stroke-width", 2)).toBe(' stroke-width="2"');
		});

		it("should handle camelCase attribute names", () => {
			expect(renderAttribute("strokeWidth", 2)).toBe(' strokeWidth="2"');
		});
	});

	describe("event handler attribute blocking", () => {
		it("should block onclick and return empty string", () => {
			expect(renderAttribute("onclick", "doSomething()")).toBe("");
		});

		it("should block onload and return empty string", () => {
			expect(renderAttribute("onload", "alert(1)")).toBe("");
		});

		it("should block onmouseover and return empty string", () => {
			expect(renderAttribute("onmouseover", "evil()")).toBe("");
		});

		it("should block event handler keys case-insensitively", () => {
			expect(renderAttribute("onClick", "doSomething()")).toBe("");
			expect(renderAttribute("ONCLICK", "doSomething()")).toBe("");
			expect(renderAttribute("OnLoad", "alert(1)")).toBe("");
		});

		it("should emit a console.warn when a forbidden key is blocked", () => {
			const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
			renderAttribute("onclick", "doSomething()");
			expect(warnSpy).toHaveBeenCalledWith(
				'[vectis] Blocked forbidden attribute key: "onclick". Event handler attributes are not allowed.',
			);
			warnSpy.mockRestore();
		});

		it("should not block attributes that contain 'on' as a substring but do not match the event handler pattern", () => {
			expect(renderAttribute("font", "serif")).toBe(' font="serif"');
			expect(renderAttribute("stroke-on-top", "red")).toBe(' stroke-on-top="red"');
			expect(renderAttribute("on-click", "val")).toBe(' on-click="val"');
		});

		it("should block keys that contain whitespace (key-splitting injection vectors)", () => {
			expect(renderAttribute("x onclick", "doSomething()")).toBe("");
			expect(renderAttribute("data-x onload", "alert(1)")).toBe("");
		});
	});
});
