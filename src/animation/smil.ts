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
	if (options.from !== undefined) attrs += ` from="${options.from}"`;
	if (options.to !== undefined) attrs += ` to="${options.to}"`;
	if (options.dur !== undefined) attrs += ` dur="${options.dur}"`;
	if (options.begin !== undefined) attrs += ` begin="${options.begin}"`;
	if (options.repeatCount !== undefined)
		attrs += ` repeatCount="${options.repeatCount}"`;
	if (options.values !== undefined) attrs += ` values="${options.values}"`;
	if (options.keyTimes !== undefined)
		attrs += ` keyTimes="${options.keyTimes}"`;
	if (options.fill !== undefined) attrs += ` fill="${options.fill}"`;
	return attrs;
}

export function renderSmilAnimation(options: SmilAnimationOptions): string {
	if (isAnimateTransform(options)) {
		const attrName = options.attributeName ?? "transform";
		return `<animateTransform attributeName="${attrName}" type="${options.type}"${renderAttrs(options)}/>`;
	}
	return `<animate attributeName="${options.attributeName}"${renderAttrs(options)}/>`;
}
