/**
 * Normalises a number value by replacing `undefined`, `NaN`, and non-finite
 * values with the given `fallback` (defaults to `0`).
 *
 * @param v - The value to sanitize.
 * @param fallback - The fallback value to use when `v` is `undefined`, `NaN`,
 *   or non-finite. Must be a finite number; if it is non-finite (e.g. `NaN`
 *   or `Infinity`), it is silently replaced by `0`.
 * @returns A finite number.
 *
 * @example
 * sanitizeNumber(undefined)          // 0
 * sanitizeNumber(NaN)                // 0
 * sanitizeNumber(Infinity)           // 0
 * sanitizeNumber(42)                 // 42
 * sanitizeNumber(undefined, 1)       // 1
 * sanitizeNumber(undefined, Infinity) // 0  (non-finite fallback replaced by 0)
 * sanitizeNumber(NaN, NaN)           // 0  (non-finite fallback replaced by 0)
 */
export function sanitizeNumber(v: number | undefined, fallback = 0): number {
	const safeFallback = Number.isFinite(fallback) ? fallback : 0;
	const n = v ?? safeFallback;
	return Number.isFinite(n) ? n : safeFallback;
}
