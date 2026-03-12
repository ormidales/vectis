import { afterEach, describe, expect, it, vi } from "vitest";
import { validatePathData } from "../src/index.js";

describe("validatePathData", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should be exported from the main entry point", () => {
		expect(validatePathData).toBeDefined();
		expect(typeof validatePathData).toBe("function");
	});

	it("should not warn for valid path data starting with M", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 L 90 90");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for valid path data starting with lowercase m", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("m 10 10 l 90 90");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for empty path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for whitespace-only path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result1 = validatePathData("   ");
		const result2 = validatePathData("\t\n  ");

		expect(result1).toBe(true);
		expect(result2).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn for invalid path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("invalid path data");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("invalid path data"),
		);
	});

	it("should warn for path data starting with numbers", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("10 10 20 20");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
	});

	it("should allow client-side validation before Path instantiation", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		// Simulates a client wanting to validate before creating a Path
		const userInput = "M 10 10 L 90 90";
		const result = validatePathData(userInput);

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should detect invalid data before Path instantiation", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		// Simulates a client detecting invalid input before creating a Path
		const userInput = "123 456";
		const result = validatePathData(userInput);

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
	});

	it("should warn for hybrid path data containing illegal alphabetic characters", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 commande_invalide");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("M 10 10 commande_invalide"),
		);
	});

	it("should include the illegal character in the warning message", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 @ 20 20");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('"@"'),
		);
	});

	it("should not warn for valid path data with multiple commands", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 L 90 90 H 50 V 50 C 10 10 20 20 30 30 Z");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn for a lone M command with no parameters", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Command "M" is missing required parameters'),
		);
	});

	it("should warn when a command requiring parameters is immediately followed by another command", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 L");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining('Command "L" is missing required parameters'),
		);
	});

	it("should warn when a command requiring parameters is followed only by whitespace then another command", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M M 10 10");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("is missing required parameters"),
		);
	});

	it("should not warn for Z command which requires no parameters", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M 10 10 Z");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for z command (lowercase) which requires no parameters", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("m 10 10 z");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn when 'e' appears as a standalone token outside a numeric exponent", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 e L10 10");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Suspicious path data"),
		);
	});

	it("should not warn for lowercase scientific notation (e.g. 1e-5)", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 L1e-5 10");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for uppercase scientific notation (e.g. 1E3)", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 L1E3 10");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should warn when 'E' (uppercase) appears as a standalone token outside a numeric exponent", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 E L10 10");

		expect(result).toBe(false);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Suspicious path data"),
		);
	});

	it("should not warn for decimal scientific notation (e.g. 1.5e-3)", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 L1.5e-3 10");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});

	it("should not warn for decimal uppercase scientific notation (e.g. 2.7E4)", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		const result = validatePathData("M0 0 L2.7E4 10");

		expect(result).toBe(true);
		expect(consoleWarnSpy).not.toHaveBeenCalled();
	});
});
