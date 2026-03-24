import { describe, expect, it } from "vitest";
import { sanitizeNumber } from "../src/utils/sanitize-number.js";

describe("sanitizeNumber", () => {
	it("should return the value when it is a finite number", () => {
		expect(sanitizeNumber(42)).toBe(42);
	});

	it("should return the value when it is a finite negative number", () => {
		expect(sanitizeNumber(-10)).toBe(-10);
	});

	it("should return the value when it is 0", () => {
		expect(sanitizeNumber(0)).toBe(0);
	});

	it("should return the fallback (0) when the value is undefined", () => {
		expect(sanitizeNumber(undefined)).toBe(0);
	});

	it("should return the fallback (0) when the value is NaN", () => {
		expect(sanitizeNumber(Number.NaN)).toBe(0);
	});

	it("should return the fallback (0) when the value is +Infinity", () => {
		expect(sanitizeNumber(Number.POSITIVE_INFINITY)).toBe(0);
	});

	it("should return the fallback (0) when the value is -Infinity", () => {
		expect(sanitizeNumber(Number.NEGATIVE_INFINITY)).toBe(0);
	});

	it("should use a custom fallback when provided and value is undefined", () => {
		expect(sanitizeNumber(undefined, 5)).toBe(5);
	});

	it("should use a custom fallback when provided and value is NaN", () => {
		expect(sanitizeNumber(Number.NaN, 99)).toBe(99);
	});

	it("should use a custom fallback when provided and value is non-finite", () => {
		expect(sanitizeNumber(Number.POSITIVE_INFINITY, 1)).toBe(1);
	});

	it("should ignore the custom fallback when the value is a valid finite number", () => {
		expect(sanitizeNumber(7, 99)).toBe(7);
	});
});
