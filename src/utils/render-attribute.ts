import { escapeXml } from "./escape.js";

/**
 * Validates and renders an SVG attribute only if the value is valid.
 *
 * A value is considered valid if it meets these criteria:
 * - Not `undefined`
 * - Not `null`
 * - Not `NaN` (for numeric values)
 * - Not `Infinity` or `-Infinity` (for numeric values)
 * - Not an empty string or whitespace-only string
 *
 * String values are automatically escaped using `escapeXml` to prevent XSS.
 * Numeric values are rendered directly without escaping.
 *
 * @param key - The SVG attribute name (e.g. `"fill"`, `"stroke-width"`).
 * @param value - The attribute value to validate and render.
 * @returns A string in the form ` key="value"` if valid, or an empty string if invalid.
 *
 * Non-integer numeric values are rendered with dynamic precision. For values
 * with magnitude ≥ 1 this always gives 4 decimal places (e.g. `Math.PI` →
 * `"3.1416"`, `1234.5` → `"1234.5"`). For values with magnitude < 1 the
 * number of decimal places is increased so that 4 significant digits are
 * preserved (e.g. `0.00001` → `"0.00001"`). Precision is capped at 10
 * decimal places and trailing zeros are stripped.
 *
 * @example
 * renderAttribute('fill', 'red');           // ' fill="red"'
 * renderAttribute('stroke-width', 2);       // ' stroke-width="2"'
 * renderAttribute('opacity', 0);            // ' opacity="0"'
 * renderAttribute('r', Math.PI);            // ' r="3.1416"'
 * renderAttribute('opacity', 0.5);          // ' opacity="0.5"'
 * renderAttribute('x', 0.00001);            // ' x="0.00001"'
 * renderAttribute('fill', undefined);       // ''
 * renderAttribute('fill', null);            // ''
 * renderAttribute('fill', '');              // ''
 * renderAttribute('transform', '   ');      // ''
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
		let rendered: string;
		if (Number.isInteger(value)) {
			rendered = String(value);
		} else {
			// Compute decimal places for rendering:
			// - Values with magnitude < 1 (negative order) get extra decimal places
			//   so that 4 significant digits are preserved (e.g. order=-5 → 9 dp).
			// - Values with magnitude ≥ 1 (order ≥ 0) are always rendered with
			//   4 decimal places regardless of their order of magnitude.
			// absValue is always > 0 here because 0 is handled by isInteger above.
			const absValue = Math.abs(value);
			const order = Math.floor(Math.log10(absValue));
			const precision = Math.max(4, Math.min(10, 4 - order));
			rendered = value.toFixed(precision).replace(/\.?0+$/, "");
		}
		return ` ${escapedKey}="${rendered}"`;
	}

	// For string values, check for empty strings and escape
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed === "") {
			return "";
		}
		return ` ${escapedKey}="${escapeXml(value)}"`;
	}

	// Default: don't render
	return "";
}
