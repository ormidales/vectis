import { escapeXml } from "../utils/escape.js";

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
	let attrs = "";
	if (options.from !== undefined) attrs += ` from="${escapeXml(options.from)}"`;
	if (options.to !== undefined) attrs += ` to="${escapeXml(options.to)}"`;
	if (options.dur !== undefined) attrs += ` dur="${escapeXml(options.dur)}"`;
	if (options.begin !== undefined)
		attrs += ` begin="${escapeXml(options.begin)}"`;
	if (options.repeatCount !== undefined)
		attrs += ` repeatCount="${typeof options.repeatCount === "string" ? escapeXml(options.repeatCount) : options.repeatCount}"`;
	if (options.values !== undefined)
		attrs += ` values="${escapeXml(options.values)}"`;
	if (options.keyTimes !== undefined)
		attrs += ` keyTimes="${escapeXml(options.keyTimes)}"`;
	if (options.fill !== undefined) attrs += ` fill="${escapeXml(options.fill)}"`;
	return attrs;
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
		const attrName = escapeXml(options.attributeName ?? "transform");
		return `<animateTransform attributeName="${attrName}" type="${escapeXml(options.type)}"${renderAttrs(options)} />`;
	}
	return `<animate attributeName="${escapeXml(options.attributeName)}"${renderAttrs(options)} />`;
}
