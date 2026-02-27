import { describe, expect, it } from "vitest";
import { escapeXml } from "../src/utils/escape.js";

describe("escapeXml", () => {
	it("should escape double quotes", () => {
		expect(escapeXml('"')).toBe("&quot;");
	});

	it("should escape single quotes", () => {
		expect(escapeXml("'")).toBe("&#39;");
	});

	it("should escape ampersands", () => {
		expect(escapeXml("&")).toBe("&amp;");
	});

	it("should escape less-than signs", () => {
		expect(escapeXml("<")).toBe("&lt;");
	});

	it("should escape greater-than signs", () => {
		expect(escapeXml(">")).toBe("&gt;");
	});

	it("should escape all special characters in a mixed string", () => {
		expect(escapeXml('<script>alert("xss")</script>')).toBe(
			"&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
		);
	});

	it("should not alter strings without special characters", () => {
		expect(escapeXml("hello world")).toBe("hello world");
	});

	it("should handle empty string", () => {
		expect(escapeXml("")).toBe("");
	});

	it("should remove null byte (\\x00)", () => {
		expect(escapeXml("hello\x00world")).toBe("helloworld");
	});

	it("should remove control characters \\x01 to \\x08", () => {
		expect(escapeXml("\x01\x02\x03\x04\x05\x06\x07\x08")).toBe("");
	});

	it("should preserve tab character (\\t)", () => {
		expect(escapeXml("hello\tworld")).toBe("hello\tworld");
	});

	it("should preserve newline character (\\n)", () => {
		expect(escapeXml("hello\nworld")).toBe("hello\nworld");
	});

	it("should preserve carriage return (\\r)", () => {
		expect(escapeXml("hello\rworld")).toBe("hello\rworld");
	});

	it("should remove control characters \\x0B to \\x1F", () => {
		expect(escapeXml("\x0B\x0C\x0E\x0F\x10\x1F")).toBe("");
	});

	it("should remove control character \\x7F (DEL)", () => {
		expect(escapeXml("hello\x7Fworld")).toBe("helloworld");
	});

	it("should handle mixed content with control characters and special XML characters", () => {
		expect(escapeXml("<script>\x00alert('xss')\x1F</script>")).toBe(
			"&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;",
		);
	});

	it("should preserve normal text with allowed whitespace", () => {
		expect(escapeXml("Line 1\nLine 2\tTabbed\rReturn")).toBe(
			"Line 1\nLine 2\tTabbed\rReturn",
		);
	});
});
