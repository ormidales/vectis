import { renderAttribute } from "../utils/render-attribute.js";

/**
 * Common timing and value options shared by all SMIL animation elements.
 */
export interface BaseAnimationOptions {
	/** Starting value of the animated attribute. */
	from?: string;
	/** Ending value of the animated attribute. */
	to?: string;
	/** Duration of one animation cycle (e.g. `"1s"`, `"500ms"`). */
	dur?: string;
	/** Time at which the animation begins (e.g. `"0s"`, `"click"`). */
	begin?: string;
	/** Number of times the animation repeats, or `"indefinite"`. */
	repeatCount?: string | number;
	/** Semicolon-separated list of intermediate values for the animation. */
	values?: string;
	/** Semicolon-separated list of time offsets corresponding to `values`. */
	keyTimes?: string;
	/**
	 * Specifies what happens to the element after the animation ends.
	 * Use `"freeze"` to hold the final value or `"remove"` to revert.
	 */
	fill?: string;
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

function isAnimateTransform(
	options: SmilAnimationOptions,
): options is AnimateTransformOptions {
	return "type" in options;
}

function renderAttrs(options: BaseAnimationOptions): string {
	return (
		renderAttribute("from", options.from) +
		renderAttribute("to", options.to) +
		renderAttribute("dur", options.dur) +
		renderAttribute("begin", options.begin) +
		renderAttribute("repeatCount", options.repeatCount) +
		renderAttribute("values", options.values) +
		renderAttribute("keyTimes", options.keyTimes) +
		renderAttribute("fill", options.fill)
	);
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
	if (isAnimateTransform(options)) {
		const attrName = renderAttribute(
			"attributeName",
			options.attributeName ?? "transform",
		);
		const typeAttr = renderAttribute("type", options.type);
		return `<animateTransform${attrName}${typeAttr}${renderAttrs(options)} />`;
	}
	const attrName = renderAttribute("attributeName", options.attributeName);
	return `<animate${attrName}${renderAttrs(options)} />`;
}
