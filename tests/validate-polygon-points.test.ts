import { afterEach, describe, expect, it, vi } from "vitest";
import { isValidPolygonPoints, validatePolygonPoints } from "../src/index.js";

describe("validatePolygonPoints", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should be exported from the main entry point", () => {
		expect(validatePolygonPoints).toBeDefined();
		expect(typeof validatePolygonPoints).toBe("function");
	});

	it("should not warn for an empty string", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for a whitespace-only string", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("   ");
		validatePolygonPoints("\t\n  ");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for a single coordinate pair with comma separator", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("0,0 50,100");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for a triangle defined with comma-separated pairs", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("0,0 50,100 100,0");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for coordinate pairs separated only by spaces", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("0 0 50 100 100 0");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for coordinate pairs with leading/trailing whitespace", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("  0,0 50,100 100,0  ");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for coordinate pairs with decimal values", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("0.5,1.5 50.25,100.75 99.9,0.1");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for coordinate pairs with signed values", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("-10,+20 50,-30 +100,0");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn for a single number (no pair)", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("100");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("100"),
		);
	});

	it("should warn for an odd number of coordinates", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("0,0 50,100 100");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
	});

	it("should warn for alphabetic characters in points", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("abc def");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("abc def"),
		);
	});

	it("should warn for HTML/script injection attempt in points", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints('<script>alert(1)</script>');

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
	});

	it("should warn for points containing onload injection", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints('0,0 50,25" onload="alert(1)');

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
	});

	it("should warn for malformed decimal numbers with multiple consecutive dots", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("1..2 3 4 5");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
	});

	it("should include the invalid points string in the warning message", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePolygonPoints("not-valid");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('"not-valid"'),
		);
	});
});

describe("Polygon constructor with skipValidation", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should not warn when skipValidation is true even for invalid points", async () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");
		const { Polygon } = await import("../src/index.js");

		new Polygon({ points: "not-valid-at-all", skipValidation: true });

		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn by default for invalid points (skipValidation not set)", async () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");
		const { Polygon } = await import("../src/index.js");

		new Polygon({ points: "not-valid-at-all" });

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid polygon points"),
		);
	});
});

describe("isValidPolygonPoints", () => {
	it("should be exported from the main entry point", () => {
		expect(isValidPolygonPoints).toBeDefined();
		expect(typeof isValidPolygonPoints).toBe("function");
	});

	it("should return true for an empty string", () => {
		expect(isValidPolygonPoints("")).toBe(true);
	});

	it("should return true for a whitespace-only string", () => {
		expect(isValidPolygonPoints("   ")).toBe(true);
		expect(isValidPolygonPoints("\t\n  ")).toBe(true);
	});

	it("should return true for a valid pair with comma separator", () => {
		expect(isValidPolygonPoints("0,0 50,100")).toBe(true);
	});

	it("should return true for a triangle defined with comma-separated pairs", () => {
		expect(isValidPolygonPoints("0,0 50,100 100,0")).toBe(true);
	});

	it("should return true for coordinate pairs separated only by spaces", () => {
		expect(isValidPolygonPoints("0 0 50 100 100 0")).toBe(true);
	});

	it("should return true for coordinate pairs with decimal values", () => {
		expect(isValidPolygonPoints("0.5,1.5 50.25,100.75 99.9,0.1")).toBe(true);
	});

	it("should return true for coordinate pairs with signed values", () => {
		expect(isValidPolygonPoints("-10,+20 50,-30 +100,0")).toBe(true);
	});

	it("should return false for a single number (no pair)", () => {
		expect(isValidPolygonPoints("100")).toBe(false);
	});

	it("should return false for an odd number of coordinates", () => {
		expect(isValidPolygonPoints("0,0 50,100 100")).toBe(false);
	});

	it("should return false for alphabetic characters in points", () => {
		expect(isValidPolygonPoints("abc def")).toBe(false);
	});

	it("should return false for HTML/script injection attempt", () => {
		expect(isValidPolygonPoints('<script>alert(1)</script>')).toBe(false);
	});

	it("should return false for malformed decimal numbers with multiple consecutive dots", () => {
		expect(isValidPolygonPoints("1..2 3 4 5")).toBe(false);
	});

	it("should not emit any console warning", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		isValidPolygonPoints("not-valid-at-all");

		expect(consoleWarnSpy).not.toHaveBeenCalled();

		vi.restoreAllMocks();
	});
});
