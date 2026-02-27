import { describe, expect, it, vi } from "vitest";
import { validatePathData } from "../src/index.js";

describe("validatePathData", () => {
	it("should be exported from the main entry point", () => {
		expect(validatePathData).toBeDefined();
		expect(typeof validatePathData).toBe("function");
	});

	it("should not warn for valid path data starting with M", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePathData("M 10 10 L 90 90");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should not warn for valid path data starting with lowercase m", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePathData("m 10 10 l 90 90");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should not warn for empty path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePathData("");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should not warn for whitespace-only path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePathData("   ");
		validatePathData("\t\n  ");

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should warn for invalid path data", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		validatePathData("invalid path data");

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

		validatePathData("10 10 20 20");

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		consoleWarnSpy.mockRestore();
	});

	it("should allow client-side validation before Path instantiation", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		// Simulates a client wanting to validate before creating a Path
		const userInput = "M 10 10 L 90 90";
		validatePathData(userInput);

		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should detect invalid data before Path instantiation", () => {
		const consoleWarnSpy = vi.spyOn(console, "warn");

		// Simulates a client detecting invalid input before creating a Path
		const userInput = "123 456";
		validatePathData(userInput);

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			expect.stringContaining("[vectis] Invalid path data"),
		);
		consoleWarnSpy.mockRestore();
	});
});
