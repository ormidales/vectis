import {
	renderSmilAnimation,
	type SmilAnimationOptions,
} from "../animation/smil.js";
import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";

export interface CircleOptions extends PresentationAttributes {
	cx?: number;
	cy?: number;
	r?: number;
}

export class Circle implements Shape {
	private readonly cx: number;
	private readonly cy: number;
	private readonly r: number;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;
	private readonly animations: SmilAnimationOptions[] = [];

	constructor(options: CircleOptions = {}) {
		this.cx = options.cx ?? 0;
		this.cy = options.cy ?? 0;
		this.r = options.r ?? 0;
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	animate(options: SmilAnimationOptions): this {
		this.animations.push(options);
		return this;
	}

	toString(): string {
		let attrs = `cx="${this.cx}" cy="${this.cy}" r="${this.r}"`;
		if (this.fill !== undefined) attrs += ` fill="${this.fill}"`;
		if (this.stroke !== undefined) attrs += ` stroke="${this.stroke}"`;
		if (this.animations.length === 0) return `<circle ${attrs}/>`;
		const content = this.animations.map(renderSmilAnimation).join("");
		return `<circle ${attrs}>${content}</circle>`;
	}
}
