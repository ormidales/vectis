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
});
