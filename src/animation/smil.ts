import { renderAttribute } from "../utils/render-attribute.js";

/**
 * Numeric value types for animations.
 * Accepts numbers or string representations including CSS units.
 *
 * @example "50", "100", "50%", "2em", "50vw", "10pt"
 */
export type NumericValue =
	| number
	| `${number}`
	| `${number}%`
	| `${number}${"px" | "em" | "rem" | "pt" | "vw" | "vh" | "vmin" | "vmax"}`;

/**
 * Color value types for SVG animations.
 * Supports hex colors, named colors, RGB/RGBA, and HSL/HSLA formats.
 *
 * @example "#ff0000", "red", "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)", "hsl(120, 100%, 50%)", "hsla(120, 100%, 50%, 0.5)"
 */
export type ColorValue =
	| `#${string}`
	| "transparent"
	| `rgb(${string})`
	| `rgba(${string})`
	| `hsl(${string})`
	| `hsla(${string})`
	| string; // Named colors and other valid CSS colors

/**
 * Translate transform value.
 * Accepts "x y" for 2D translation or just "x" for horizontal-only translation.
 *
 * @example
 * // Two-parameter form: horizontal and vertical offset
 * "50 100"
 * // Single-parameter form: horizontal offset only
 * "50"
 */
export type TranslateValue = `${number} ${number}` | `${number}`;

/**
 * Scale transform value.
 * Accepts "sx sy" for independent scaling or just "sx" for uniform scaling.
 *
 * @example
 * // Two-parameter form: independent horizontal and vertical scaling
 * "2 1.5"
 * // Single-parameter form: uniform scaling
 * "2"
 */
export type ScaleValue = `${number} ${number}` | `${number}`;

/**
 * Rotate transform value.
 * Accepts "angle cx cy" with rotation center or just "angle" to rotate around origin.
 *
 * @example
 * // Three-parameter form: angle and center point (cx, cy)
 * "45 50 50"
 * // Single-parameter form: angle only (rotates around origin)
 * "45"
 */
export type RotateValue = `${number} ${number} ${number}` | `${number}`;

/**
 * SkewX transform value.
 * Accepts a single angle value for horizontal skew.
 *
 * @example
 * "30"
 */
export type SkewXValue = `${number}`;

/**
 * SkewY transform value.
 * Accepts a single angle value for vertical skew.
 *
 * @example
 * "30"
 */
export type SkewYValue = `${number}`;

/**
 * Transform value types for animateTransform.
 * Space-separated numeric values depending on transform type.
 *
 * Use the more specific types ({@link TranslateValue}, {@link ScaleValue}, {@link RotateValue},
 * {@link SkewXValue}, {@link SkewYValue}) for better IDE autocomplete and type safety,
 * or use the general {@link TransformValue} type for flexibility.
 *
 * @example
 * // translate: "x y" or "x"
 * "50 100"
 * // scale: "sx sy" or "sx"
 * "2" or "2 1.5"
 * // rotate: "angle cx cy" or "angle"
 * "45 50 50"
 * // skewX/skewY: "angle"
 * "30"
 */
export type TransformValue =
	| TranslateValue
	| ScaleValue
	| RotateValue
	| SkewXValue
	| SkewYValue
	| string; // Fallback for runtime string values

/**
 * Animation value type - can be numeric, color, transform, or any other valid SVG attribute value.
 * This provides better type hints while remaining flexible for various animation types.
 */
export type AnimationValue = NumericValue | ColorValue | TransformValue | string;

/**
 * Common timing and value options shared by all SMIL animation elements.
 */
export interface BaseAnimationOptions {
	/**
	 * Starting value of the animated attribute.
	 * Use appropriate format based on the attribute being animated:
	 * - Numeric attributes: numbers or string numbers (e.g. `"50"`, `"100%"`)
	 * - Color attributes: hex, named colors, or rgb/rgba (e.g. `"#ff0000"`, `"red"`)
	 * - Transform attributes: space-separated values (e.g. `"0 0"` for translate)
	 *
	 * @example "50", "100", "#ff0000", "0 0"
	 */
	from?: AnimationValue;
	/**
	 * Ending value of the animated attribute.
	 * Use appropriate format based on the attribute being animated:
	 * - Numeric attributes: numbers or string numbers (e.g. `"50"`, `"100%"`)
	 * - Color attributes: hex, named colors, or rgb/rgba (e.g. `"#ff0000"`, `"red"`)
	 * - Transform attributes: space-separated values (e.g. `"100 100"` for translate)
	 *
	 * @example "100", "200", "#00ff00", "100 100"
	 */
	to?: AnimationValue;
	/** Duration of one animation cycle (e.g. `"1s"`, `"500ms"`). */
	dur?: string;
	/** Time at which the animation begins (e.g. `"0s"`, `"click"`). */
	begin?: string;
	/** Number of times the animation repeats, or `"indefinite"`. */
	repeatCount?: string | number;
	/**
	 * Semicolon-separated list of intermediate values for the animation.
	 * Each value should match the format of the attribute being animated.
	 *
	 * @example
	 * // For numeric attributes:
	 * "10;20;10"
	 * // For color attributes:
	 * "#ff0000;#00ff00;#0000ff"
	 * // For transform attributes:
	 * "0 0;50 50;100 100"
	 */
	values?: string;
	/** Semicolon-separated list of time offsets corresponding to `values`. */
	keyTimes?: string;
	/**
	 * Specifies what happens to the element after the animation ends.
	 * Use `"freeze"` to hold the final value or `"remove"` to revert.
	 */
	fill?: "freeze" | "remove";
}

/**
 * Options for a SMIL `<animate>` element that animates a single attribute.
 */
export interface AnimateOptions extends BaseAnimationOptions {
	/** Name of the SVG attribute to animate (e.g. `"cx"`, `"opacity"`). */
	attributeName: string;
}

/**
 * Options for a SMIL `<animateTransform>` element that animates a transform attribute.
 */
export interface AnimateTransformOptions extends BaseAnimationOptions {
	/** Transform type to animate. */
	type: "translate" | "rotate" | "scale" | "skewX" | "skewY";
	/**
	 * Name of the attribute to animate. Defaults to `"transform"` when omitted.
	 */
	attributeName?: string;
}

/**
 * Union type representing either an `<animate>` or `<animateTransform>` configuration.
 */
export type SmilAnimationOptions = AnimateOptions | AnimateTransformOptions;

function isAnimateTransform(options: SmilAnimationOptions): options is AnimateTransformOptions {
	return "type" in options;
}

/**
 * Regular expression for valid SMIL clock/time-count values.
 * Accepts:
 * - The keyword `indefinite`
 * - Timecount values: a non-negative number followed by `h`, `min`, `s`, or `ms`
 * - Full clock values: `hh:mm:ss[.fraction]` (minutes and seconds constrained to 00–59)
 * - Partial clock values: `mm:ss[.fraction]` (minutes and seconds constrained to 00–59)
 */
const SMIL_TIME_PATTERN =
	/^(?:indefinite|\d+(?:\.\d+)?(?:h|min|s|ms)|(?:\d+:)?[0-5]\d:[0-5]\d(?:\.\d+)?)$/;

/**
 * Regular expression for a single SMIL begin value.
 * In addition to the time/clock formats accepted by {@link SMIL_TIME_PATTERN}, `begin`
 * also accepts SMIL event-reference syntax:
 * - Bare event names: `"click"`, `"mouseover"`
 * - Syncbase references: `"myId.begin"`, `"myId.end"`
 * - Event references with optional time offset: `"click+1s"`, `"myId.begin-500ms"`
 */
const SMIL_BEGIN_SINGLE_PATTERN =
	/^(?:indefinite|\d+(?:\.\d+)?(?:h|min|s|ms)|(?:\d+:)?[0-5]\d:[0-5]\d(?:\.\d+)?|[A-Za-z_][\w\-.]*(?:[+-]\d+(?:\.\d+)?(?:h|min|s|ms))?)$/;

/**
 * Validates a SMIL clock value (used in `dur`, `end`, `repeatDur`, etc.).
 * Accepts values such as `"1s"`, `"500ms"`, `"2.5s"`, `"2h"`, `"30min"`,
 * clock values like `"01:30"` (mm:ss) or `"1:01:30"` (h:mm:ss),
 * and the special keyword `"indefinite"`.
 *
 * Emits a `console.warn` when the value does not match a recognised SMIL clock format.
 *
 * @param value - The time string to validate.
 * @param attrName - Optional attribute name used in the warning message for context.
 * @returns `true` if the value is a valid SMIL clock value, `false` otherwise.
 */
export function validateSmilTime(value: string, attrName?: string): boolean {
	if (!SMIL_TIME_PATTERN.test(value)) {
		const attrPart = attrName ? ` for "${attrName}"` : "";
		console.warn(
			`[vectis] Invalid SMIL time value${attrPart}: "${value}". ` +
				`Expected a value like "1s", "500ms", "2h", "30min", "01:30" or "indefinite". ` +
				`The animation may not work correctly in browsers.`,
		);
		return false;
	}
	return true;
}

/**
 * Validates a SMIL `begin` attribute value.
 * Accepts clock values (e.g. `"0s"`, `"500ms"`), event values (e.g. `"click"`,
 * `"myId.begin"`, `"myId.end+1s"`), and the special keyword `"indefinite"`.
 * A semicolon-separated list of such values is also accepted.
 *
 * Emits a `console.warn` when any semicolon-separated entry is not recognised
 * as a valid SMIL begin value.
 *
 * @param value - The begin attribute string to validate.
 * @returns `true` if the value matches a recognised SMIL begin format, `false` otherwise.
 */
export function validateSmilBegin(value: string): boolean {
	const parts = value.split(";").map((s) => s.trim());
	const hasInvalid = parts.some((part) => !SMIL_BEGIN_SINGLE_PATTERN.test(part));
	if (hasInvalid) {
		console.warn(
			`[vectis] Invalid SMIL begin value: "${value}". ` +
				`Expected a time value (e.g. "0.5s", "01:30"), an event reference (e.g. "click", "myId.begin+1s"), or "indefinite". ` +
				`The animation may not work correctly in browsers.`,
		);
		return false;
	}
	return true;
}

/**
 * Pattern matching HTML/SVG event-handler attribute names (e.g. `onload`, `onclick`).
 * These are not valid SVG animation targets and should never appear as `attributeName`
 * values. Maintained here so future contributors can extend the check if needed.
 */
const FORBIDDEN_ATTR_PATTERN = /^on[a-z]+$/i;

/**
 * Validates a SMIL `attributeName` value and emits a warning when the name looks
 * like an event-handler attribute (matches {@link FORBIDDEN_ATTR_PATTERN}).
 *
 * Event-handler names such as `"onload"` or `"onclick"` are not valid SVG animation
 * targets. While `escapeXml` prevents raw script injection, passing such a name as
 * `attributeName` can confuse certain SVG renderers or post-processors.
 *
 * The value is trimmed before matching so that incidental leading/trailing whitespace
 * (e.g. `" onload "`) is also detected. Note that the rendered attribute still uses
 * the original value via `renderAttribute`/`escapeXml`, so whitespace-padded names
 * produce an invalid (but non-dangerous) SVG attribute.
 *
 * @param name - The `attributeName` string to validate.
 */
export function validateAnimationAttributeName(name: string): void {
	if (FORBIDDEN_ATTR_PATTERN.test(name.trim())) {
		console.warn(
			`[vectis] Suspicious animation attributeName: "${name}". ` +
				`Event handler names are not valid SVG animation targets and may be ignored by some SVG renderers.`,
		);
	}
}

// Renders common timing attributes (dur, begin, from/to, repeatCount, values, keyTimes, fill)
// for SMIL elements.
function renderAttrs(options: BaseAnimationOptions): string {
	if (options.dur !== undefined) {
		validateSmilTime(options.dur, "dur");
	}
	if (options.begin !== undefined) {
		validateSmilBegin(options.begin);
	}
	const parts: string[] = [
		renderAttribute("from", options.from),
		renderAttribute("to", options.to),
		renderAttribute("dur", options.dur),
		renderAttribute("begin", options.begin),
		renderAttribute("repeatCount", options.repeatCount),
		renderAttribute("values", options.values),
		renderAttribute("keyTimes", options.keyTimes),
		renderAttribute("fill", options.fill),
	];
	return parts.join("");
}

/**
 * Serializes a {@link SmilAnimationOptions} descriptor into a SMIL animation element string.
 *
 * Produces an `<animate>` element when `options` contains `attributeName` without a `type`
 * field (i.e. {@link AnimateOptions}), or an `<animateTransform>` element when a `type` field
 * (e.g. `"rotate"`) is present (i.e. {@link AnimateTransformOptions}).
 *
 * @param options - Animation configuration. Use {@link AnimateOptions} for `<animate>`
 *   or {@link AnimateTransformOptions} for `<animateTransform>`.
 * @returns A self-closing SVG SMIL element string with normalized spacing.
 *
 * @example
 * renderSmilAnimation({ attributeName: 'cx', from: '0', to: '100', dur: '1s' });
 * // '<animate attributeName="cx" from="0" to="100" dur="1s" />'
 *
 * @example
 * renderSmilAnimation({ type: 'rotate', from: '0', to: '360', dur: '2s' });
 * // '<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" />'
 */
export function renderSmilAnimation(options: SmilAnimationOptions): string {
	let result: string;
	if (isAnimateTransform(options)) {
		const resolvedAttrName = options.attributeName ?? "transform";
		validateAnimationAttributeName(resolvedAttrName);
		const attrName = renderAttribute("attributeName", resolvedAttrName);
		const typeAttr = renderAttribute("type", options.type);
		result = `<animateTransform${attrName}${typeAttr}${renderAttrs(options)} />`;
	} else {
		validateAnimationAttributeName(options.attributeName);
		const attrName = renderAttribute("attributeName", options.attributeName);
		result = `<animate${attrName}${renderAttrs(options)} />`;
	}
	// Normalize spacing: replace multiple consecutive spaces with a single space
	return result.replace(/ {2,}/g, " ");
}
