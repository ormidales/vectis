import {
	renderSmilAnimation,
	type SmilAnimationOptions,
} from "../animation/smil.js";
import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export interface PathOptions extends PresentationAttributes {
	d?: string;
}

export class Path implements Shape {
	private readonly d: string;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;
	private animations: SmilAnimationOptions[] = [];

	constructor(options: PathOptions = {}) {
		this.d = options.d ?? "";
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	animate(options: SmilAnimationOptions): this {
		this.animations.push(options);
		return this;
	}

	toString(): string {
		let attrs = `d="${escapeXml(this.d)}"`;
		if (this.fill !== undefined) attrs += ` fill="${escapeXml(this.fill)}"`;
		if (this.stroke !== undefined)
			attrs += ` stroke="${escapeXml(this.stroke)}"`;
		if (this.animations.length === 0) return `<path ${attrs}/>`;
		const content = this.animations.map(renderSmilAnimation).join("");
		return `<path ${attrs}>${content}</path>`;
	}
}
