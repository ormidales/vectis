import { describe, expect, it, vi } from "vitest";
import { SvgCanvas } from "../src/index.js";

describe("SvgCanvas", () => {
	it("should generate an svg element with default attributes", () => {
		const canvas = new SvgCanvas();
		const output = canvas.toString();

		expect(output).toContain("<svg");
		expect(output).toContain('xmlns="http://www.w3.org/2000/svg"');
		expect(output).toContain('viewBox="0 0 300 150"');
		expect(output).toContain('width="300"');
		expect(output).toContain('height="150"');
		expect(output).toContain("/>");
	});

	it("should accept custom width and height", () => {
		const canvas = new SvgCanvas({ width: 800, height: 600 });
		const output = canvas.toString();

		expect(output).toContain('width="800"');
		expect(output).toContain('height="600"');
		expect(output).toContain('viewBox="0 0 800 600"');
	});

	it("should accept a custom viewBox", () => {
		const canvas = new SvgCanvas({ viewBox: "0 0 100 100" });
		const output = canvas.toString();

		expect(output).toContain('viewBox="0 0 100 100"');
	});

	it("should return a valid SVG string", () => {
		const canvas = new SvgCanvas({ width: 500, height: 400 });
		const output = canvas.toString();

		expect(output).toBe(
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="500" height="400"/>',
		);
	});

	it("should accept string width and height", () => {
		const canvas = new SvgCanvas({ width: "100%", height: "100%" });
		const output = canvas.toString();

		expect(output).toContain('width="100%"');
		expect(output).toContain('height="100%"');
		expect(output).toContain('viewBox="0 0 300 150"');
	});

	it("should accept em-based string dimensions", () => {
		const canvas = new SvgCanvas({ width: "50em", height: "30em" });
		const output = canvas.toString();

		expect(output).toContain('width="50em"');
		expect(output).toContain('height="30em"');
	});

	it("should escape special characters in string dimensions", () => {
		const canvas = new SvgCanvas({ width: '"><script>', height: "100%" });
		const output = canvas.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain('width="&quot;&gt;&lt;script&gt;"');
	});

	it("should escape special characters in viewBox", () => {
		const canvas = new SvgCanvas({ viewBox: '0 0 300 150"><script>xss</script>' });
		const output = canvas.toString();

		expect(output).not.toContain("<script>");
		expect(output).toContain("&lt;script&gt;");
	});

	describe("namespaces", () => {
		it("should not add extra xmlns attributes when namespaces is omitted", () => {
			const canvas = new SvgCanvas({ width: 100, height: 100 });
			const output = canvas.toString();

			expect(output).toBe(
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"/>',
			);
		});

		it("should not add extra xmlns attributes when namespaces is empty", () => {
			const canvas = new SvgCanvas({ width: 100, height: 100, namespaces: {} });
			const output = canvas.toString();

			expect(output).toBe(
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"/>',
			);
		});

		it("should add a single xmlns:xlink namespace", () => {
			const canvas = new SvgCanvas({
				namespaces: { xlink: "http://www.w3.org/1999/xlink" },
			});
			const output = canvas.toString();

			expect(output).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
		});

		it("should add multiple namespaces in declaration order", () => {
			const canvas = new SvgCanvas({
				namespaces: {
					xlink: "http://www.w3.org/1999/xlink",
					dc: "http://purl.org/dc/elements/1.1/",
				},
			});
			const output = canvas.toString();

			const xlinkAttr = 'xmlns:xlink="http://www.w3.org/1999/xlink"';
			const dcAttr = 'xmlns:dc="http://purl.org/dc/elements/1.1/"';

			expect(output).toContain(xlinkAttr);
			expect(output).toContain(dcAttr);
			expect(output.indexOf(xlinkAttr)).toBeLessThan(output.indexOf(dcAttr));
		});

		it("should place extra namespaces after the default xmlns and before viewBox", () => {
			const canvas = new SvgCanvas({
				width: 200,
				height: 200,
				namespaces: { xlink: "http://www.w3.org/1999/xlink" },
			});
			const output = canvas.toString();

			expect(output).toBe(
				'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 200" width="200" height="200"/>',
			);
		});

		it("should escape special characters in namespace URI", () => {
			const canvas = new SvgCanvas({
				namespaces: { custom: 'http://example.com/"xss"' },
			});
			const output = canvas.toString();

			expect(output).not.toContain('"xss"');
			expect(output).toContain('xmlns:custom="http://example.com/&quot;xss&quot;"');
		});

		it("should skip and warn for an empty namespace prefix", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({ namespaces: { "": "http://example.com/" } });
			const output = canvas.toString();

			expect(output).not.toContain("http://example.com/");
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should skip and warn for a namespace prefix containing a colon", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({ namespaces: { "bad:prefix": "http://example.com/" } });
			const output = canvas.toString();

			expect(output).not.toContain("bad:prefix");
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should skip and warn for a namespace prefix containing spaces", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({ namespaces: { "bad prefix": "http://example.com/" } });
			const output = canvas.toString();

			expect(output).not.toContain("bad prefix");
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should skip and warn for the reserved prefix 'xml'", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({
				namespaces: { xml: "http://www.w3.org/XML/1998/namespace" },
			});
			const output = canvas.toString();

			expect(output).not.toContain("xmlns:xml");
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should skip and warn for the reserved prefix 'xmlns'", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({ namespaces: { xmlns: "http://example.com/" } });
			const output = canvas.toString();

			expect(output).not.toContain("xmlns:xmlns");
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should skip invalid prefix while still rendering valid ones", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({
				namespaces: {
					"bad:one": "http://example.com/bad",
					xlink: "http://www.w3.org/1999/xlink",
				},
			});
			const output = canvas.toString();

			expect(output).not.toContain("bad:one");
			expect(output).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid namespace prefix"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn only once at construction even when toString() is called multiple times", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({ namespaces: { "bad:prefix": "http://example.com/" } });

			canvas.toString();
			canvas.toString();
			canvas.toString();

			expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
			consoleWarnSpy.mockRestore();
		});

		it("should not reflect post-construction mutations of the caller's namespaces object", () => {
			const ns: Record<string, string> = { xlink: "http://www.w3.org/1999/xlink" };
			const canvas = new SvgCanvas({ namespaces: ns });

			ns["custom"] = "http://example.com/custom";
			delete ns["xlink"];

			const output = canvas.toString();

			expect(output).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
			expect(output).not.toContain("custom");
		});
	});

	describe("string dimension validation", () => {
		it("should not warn for valid percentage width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "100%", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid em-based width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "50em", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid px width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "300px", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid unitless numeric string width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "300", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid rem height", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: 300, height: "10rem", viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid vw/vh dimensions", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "100vw", height: "100vh", viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should warn for width with CSS injection attempt", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "100%; background: red", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Suspicious width value"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for height with CSS injection attempt", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: 300, height: "100%; color: red", viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Suspicious height value"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for calc() expression in width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "calc(100%)", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Suspicious width value"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should include the suspicious value in the warning message", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			new SvgCanvas({ width: "0 + calc(100%)", height: 150, viewBox: "0 0 300 150" });
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('"0 + calc(100%)"'),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn only once per invalid dimension at construction", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");
			const canvas = new SvgCanvas({
				width: "bad!value",
				height: 150,
				viewBox: "0 0 300 150",
			});
			canvas.toString();
			canvas.toString();
			expect(
				consoleWarnSpy.mock.calls.filter((c) => String(c[0]).includes("Suspicious width")).length,
			).toBe(1);
			consoleWarnSpy.mockRestore();
		});
	});

	describe("string dimensions without explicit viewBox", () => {
		it("should warn when width is a string and no viewBox is provided", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: "100%", height: 150 });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"[vectis] width/height are strings but no viewBox was provided",
				),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn when height is a string and no viewBox is provided", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: 300, height: "100%" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"[vectis] width/height are strings but no viewBox was provided",
				),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn when both width and height are strings and no viewBox is provided", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: "100%", height: "100%" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					"[vectis] width/height are strings but no viewBox was provided",
				),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should include the defaulted viewBox value in the warning message", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: "100%", height: "100%" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining('"0 0 300 150"'),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should not warn when string dimensions are used with an explicit viewBox", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: "100%", height: "100%", viewBox: "0 0 300 150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn when both width and height are numbers and no viewBox is provided", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ width: 300, height: 150 });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});
	});

	describe("ViewBox validation", () => {
		it("should not warn for valid viewBox with 4 integers", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 300 150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with negative values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "-10 -10 100 100" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with decimal values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0.5 0.5 99.5 99.5" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with leading whitespace", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "  0 0 300 150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with trailing whitespace", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 300 150  " });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with comma separators", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0,0,300,150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with comma and space separators", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0, 0, 300, 150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with spaces around comma separators", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 , 0 , 300 , 150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for default viewBox", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas();

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should warn for invalid viewBox with text", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "valeur incorrecte" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("valeur incorrecte"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with only 3 values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 300" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with only 2 values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with 5 values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 300 150 100" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for empty viewBox string", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with non-numeric values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 abc def" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with scientific notation values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 1e-4 1e-4" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with uppercase scientific notation", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 1E+4 2E4" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with negative scientific notation values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "-1e2 -1e2 1e2 1e2" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox mixing decimal and scientific notation", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 1.5e3 2.5e3" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with decimal values omitting the leading zero", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: ".5 .5 100 100" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox mixing leading-zero-omitted and normal decimal values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "-.5 -.5 99.5 99.5" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with mixed numeric and non-numeric values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 300 abc" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox format"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with explicit positive sign on scientific notation", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 +1e4 1e4" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with explicit positive sign on all values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "+0 +0 +300 +150" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for valid viewBox with explicit positive sign on decimal values", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "+.5 +.5 +99.5 +99.5" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with negative width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 -100 100" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: width must be strictly positive"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with negative height", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 100 -100" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: height must be strictly positive"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with zero width", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 0 100" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: width must be strictly positive"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for viewBox with zero height", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 100 0" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: height must be strictly positive"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should warn for both width and height when both are negative", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "0 0 -100 -100" });

			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: width must be strictly positive"),
			);
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				expect.stringContaining("[vectis] Invalid viewBox: height must be strictly positive"),
			);
			consoleWarnSpy.mockRestore();
		});

		it("should not warn for viewBox with negative min-x and min-y but positive dimensions", () => {
			const consoleWarnSpy = vi.spyOn(console, "warn");

			new SvgCanvas({ viewBox: "-50 -50 100 100" });

			expect(consoleWarnSpy).not.toHaveBeenCalled();
			consoleWarnSpy.mockRestore();
		});
	});
});

