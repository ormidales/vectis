import { escapeXml } from "./escape.js";

const FORBIDDEN_KEY_PATTERN = /^on[a-z]+$/i;
const UNSAFE_KEY_CHARS_PATTERN = /[\s=]/;

/**
 * Returns `true` if the attribute key is safe to use in SVG output.
 * Rejects keys that contain whitespace or `=`, and event-handler names (e.g. `onclick`).
 *
 * @param key - The SVG attribute name to validate.
 * @returns `true` if the key is valid, `false` otherwise.
 *
 * @example
 * isValidAttributeKey('fill');       // true
 * isValidAttributeKey('stroke-width'); // true
 * isValidAttributeKey('onclick');    // false
 * isValidAttributeKey('x y');        // false
 * isValidAttributeKey('x=y');        // false
 */
export function isValidAttributeKey(key: string): boolean {
	if (UNSAFE_KEY_CHARS_PATTERN.test(key)) return false;
	if (FORBIDDEN_KEY_PATTERN.test(key.trim())) return false;
	return true;
}

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
 * Note: the numeric value `0` is considered valid and will be rendered.
 *
 * String values are automatically escaped using `escapeXml` to prevent XSS.
 * Numeric values are rendered directly without escaping.
 *
 * @param key - The SVG attribute name (e.g. `"fill"`, `"stroke-width"`).
 * @param value - The attribute value to validate and render.
 * @returns A string in the form ` key="value"` if valid, or an empty string if invalid.
 *
 * Non-integer numeric values are rounded using a computed number of decimal
 * places (magnitude ≥ 1: 4 dp; magnitude < 1: more dp to keep ~4 sig figs
 * where present), then trailing zeros are stripped. For example, `Math.PI`
 * rounds to `"3.1416"`, `1234.5` rounds to `"1234.5"`, and `0.00001`
 * rounds to `"0.00001"`. Precision is capped at 10 decimal places.
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

	if (!isValidAttributeKey(key)) {
		if (UNSAFE_KEY_CHARS_PATTERN.test(key)) {
			console.warn(
				`[vectis] Blocked invalid attribute key: "${key}". Attribute keys must not contain whitespace or '=' characters.`,
			);
		} else {
			const trimmedKey = key.trim();
			console.warn(
				`[vectis] Blocked forbidden attribute key: "${trimmedKey}". Event handler attributes are not allowed.`,
			);
		}
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
			//   so that ~4 significant digits are kept where present (e.g. order=-5 → 9 dp).
			// - Values with magnitude ≥ 1 (order ≥ 0) are rounded at 4 decimal places.
			// In both cases, trailing zeros (and the decimal point if unneeded) are stripped.
			// absValue is always > 0 here because 0 is handled by isInteger above.
			//
			// Example: value = 0.00314
			//   absValue = 0.00314, order = floor(log10(0.00314)) = -3
			//   precision = max(4, min(10, 4 - (-3))) = max(4, 7) = 7
			//   toFixed(7) → "0.0031400" → strip → "0.00314"
			const absValue = Math.abs(value); // always > 0: a non-integer value is never zero
			const order = Math.floor(Math.log10(absValue)); // magnitude exponent (e.g. 0.003 → -3, 3.14 → 0)
			const precision = Math.max(4, Math.min(10, 4 - order)); // dp needed for ~4 sig figs, clamped to [4, 10]
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
