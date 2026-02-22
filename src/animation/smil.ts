import { escapeXml } from "../utils/escape.js";

export interface BaseAnimationOptions {
	from?: string;
	to?: string;
	dur?: string;
	begin?: string;
	repeatCount?: string | number;
	values?: string;
	keyTimes?: string;
	fill?: string;
}

export interface AnimateOptions extends BaseAnimationOptions {
	attributeName: string;
}

export interface AnimateTransformOptions extends BaseAnimationOptions {
	type: "translate" | "rotate" | "scale" | "skewX" | "skewY";
	attributeName?: string;
}

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

export function renderSmilAnimation(options: SmilAnimationOptions): string {
	if (isAnimateTransform(options)) {
		const attrName = escapeXml(options.attributeName ?? "transform");
		return `<animateTransform attributeName="${attrName}" type="${escapeXml(options.type)}"${renderAttrs(options)}/>`;
	}
	return `<animate attributeName="${escapeXml(options.attributeName)}"${renderAttrs(options)}/>`;
}
