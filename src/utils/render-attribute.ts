import { escapeXml } from "./escape.js";

/**
 * Validates and renders an SVG attribute only if the value is valid.
 *
 * A value is considered valid if it meets these criteria:
 * - Not `undefined`
 * - Not `null`
 * - Not `NaN` (for numeric values)
 * - Not `Infinity` or `-Infinity` (for numeric values)
 * - Not an empty string
 *
 * String values are automatically escaped using `escapeXml` to prevent XSS.
 * Numeric values are rendered directly without escaping.
 *
 * @param key - The SVG attribute name (e.g. `"fill"`, `"stroke-width"`).
 * @param value - The attribute value to validate and render.
 * @returns A string in the form ` key="value"` if valid, or an empty string if invalid.
 *
 * @example
 * renderAttribute('fill', 'red');           // ' fill="red"'
 * renderAttribute('stroke-width', 2);       // ' stroke-width="2"'
 * renderAttribute('opacity', 0);            // ' opacity="0"'
 * renderAttribute('fill', undefined);       // ''
 * renderAttribute('fill', null);            // ''
 * renderAttribute('fill', '');              // ''
 * renderAttribute('opacity', NaN);          // ''
 * renderAttribute('x', Infinity);           // ''
 */
export function renderAttribute(key: string, value: string | number | undefined | null): string {
	// Filter out invalid values
	if (value === undefined || value === null) {
		return "";
	}

	const escapedKey = escapeXml(key);

	// For numeric values, check for NaN and Infinity
	if (typeof value === "number") {
		if (!Number.isFinite(value)) {
			return "";
		}
		return ` ${escapedKey}="${value}"`;
	}

	// For string values, check for empty strings and escape
	if (typeof value === "string") {
		if (value === "") {
			return "";
		}
		return ` ${escapedKey}="${escapeXml(value)}"`;
	}

	// Default: don't render
	return "";
}
