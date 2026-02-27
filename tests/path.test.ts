import { describe, expect, it, vi } from "vitest";
import { Path } from "../src/index.js";

describe("Path", () => {
	it("should generate a path element with default attributes", () => {
		const path = new Path();
		const output = path.toString();

		expect(output).toBe('<path />');
	});

	it("should accept a custom d attribute", () => {
		const path = new Path({ d: "M 10 10 L 90 90" });
		const output = path.toString();

		expect(output).toBe('<path d="M 10 10 L 90 90"/>');
	});

	it("should include fill attribute when specified", () => {
		const path = new Path({ d: "M 0 0", fill: "none" });
		const output = path.toString();

		expect(output).toContain('fill="none"');
	});

	it("should include stroke attribute when specified", () => {
		const path = new Path({ d: "M 0 0", stroke: "red" });
		const output = path.toString();

		expect(output).toContain('stroke="red"');
	});

	it("should include both fill and stroke when specified", () => {
		const path = new Path({ d: "M 0 0 L 100 100", fill: "none", stroke: "red" });
		const output = path.toString();

		expect(output).toBe('<path d="M 0 0 L 100 100" fill="none" stroke="red"/>');
	});

	it("should escape special characters in d to prevent XSS", () => {
		const path = new Path({ d: 'M 0 0" onload="alert(1)' });
		const output = path.toString();

		expect(output).not.toContain('"M 0 0" onload="alert(1)"');
		expect(output).toContain("&quot;");
	});

	it("should escape special characters in fill to prevent XSS", () => {
		const path = new Path({ d: "M 0 0", fill: '<script>alert(1)</script>' });
		const output = path.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	it("should include stroke-width attribute when specified", () => {
		const path = new Path({ d: "M 0 0", stroke: "red", strokeWidth: 2 });
		const output = path.toString();

		expect(output).toContain('stroke-width="2"');
	});

	it("should include opacity attribute when specified", () => {
		const path = new Path({ d: "M 0 0", opacity: 0.5 });
		const output = path.toString();

		expect(output).toContain('opacity="0.5"');
	});

	describe("Path data validation", () => {
		it("should not warn for valid path data starting with M", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "M 10 10 L 90 90" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid path data starting with lowercase m", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "m 10 10 l 90 90" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid path data with leading whitespace", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "  M 10 10 L 90 90" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for empty path data", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for whitespace-only path data", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "   " });
			new Path({ d: "\t\n  " });
			new Path({ d: " " });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for path data starting with other valid commands (L, C, A, Z)", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "L 10 10" });
			new Path({ d: "C 10 10 20 20 30 30" });
			new Path({ d: "A 10 10 0 0 1 50 50" });
			new Path({ d: "Z" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should warn for invalid path data", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "invalid path data" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid path data"),
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("invalid path data"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for path data starting with numbers", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "10 10 20 20" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid path data"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for path data with only whitespace followed by invalid content", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new Path({ d: "   invalid" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid path data"),
			);
			consoleWarnSpy.mockRestore();
		});
	});

	describe("getter methods", () => {
		it("should return d value via getD()", () => {
			const path = new Path({ d: "M 10 10 L 90 90" });
			expect(path.getD()).toBe("M 10 10 L 90 90");
		});

		it("should return empty string when d is not specified", () => {
			const path = new Path();
			expect(path.getD()).toBe("");
		});

		it("should return correct d value after construction", () => {
			const pathData = "M 0 0 L 100 100 L 100 0 Z";
			const path = new Path({ d: pathData });
			expect(path.getD()).toBe(pathData);
		});

		it("should return d value with special characters", () => {
			const pathData = "M 10,10 C 20,20 40,20 50,10";
			const path = new Path({ d: pathData });
			expect(path.getD()).toBe(pathData);
		});
	});
});
