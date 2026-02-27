import { renderAttribute } from "../utils/render-attribute.js";

/**
 * Numeric value types for animations.
 * Accepts numbers or string representations including CSS units.
 *
 * @example "50", "100", "50%", "2em"
 */
export type NumericValue = number | `${number}` | `${number}%` | `${number}${"px" | "em" | "rem"}`;

/**
 * Color value types for SVG animations.
 * Supports hex colors, named colors, and RGB/RGBA formats.
 *
 * @example "#ff0000", "red", "rgb(255, 0, 0)", "rgba(255, 0, 0, 0.5)"
 */
export type ColorValue =
	| `#${string}`
	| "transparent"
	| `rgb(${string})`
	| `rgba(${string})`
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

function renderAttrs(options: BaseAnimationOptions): string {
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
 * Produces either an `<animate>` or `<animateTransform>` element depending on the options type.
 *
 * @param options - The animation configuration to serialise.
 * @returns An SVG SMIL animation element string.
 *
 * @example
 * renderSmilAnimation({ attributeName: 'cx', from: '0', to: '100', dur: '1s' });
 * // '<animate attributeName="cx" from="0" to="100" dur="1s" />'
 */
export function renderSmilAnimation(options: SmilAnimationOptions): string {
	let result: string;
	if (isAnimateTransform(options)) {
		const attrName = renderAttribute("attributeName", options.attributeName ?? "transform");
		const typeAttr = renderAttribute("type", options.type);
		result = `<animateTransform${attrName}${typeAttr}${renderAttrs(options)} />`;
	} else {
		const attrName = renderAttribute("attributeName", options.attributeName);
		result = `<animate${attrName}${renderAttrs(options)} />`;
	}
	// Normalize spacing: replace multiple consecutive spaces with a single space
	return result.replace(/ {2,}/g, " ");
}
