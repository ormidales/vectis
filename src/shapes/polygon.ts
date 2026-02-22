import {
	renderSmilAnimation,
	type SmilAnimationOptions,
} from "../animation/smil.js";
import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export interface PolygonOptions extends PresentationAttributes {
	points?: string;
}

export class Polygon implements Shape {
	private readonly points: string;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;
	private animations: SmilAnimationOptions[] = [];

	constructor(options: PolygonOptions = {}) {
		this.points = options.points ?? "";
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	animate(options: SmilAnimationOptions): this {
		this.animations.push(options);
		return this;
	}

	toString(): string {
		let attrs = `points="${escapeXml(this.points)}"`;
		if (this.fill !== undefined) attrs += ` fill="${escapeXml(this.fill)}"`;
		if (this.stroke !== undefined)
			attrs += ` stroke="${escapeXml(this.stroke)}"`;
		if (this.animations.length === 0) return `<polygon ${attrs}/>`;
		const content = this.animations.map(renderSmilAnimation).join("");
		return `<polygon ${attrs}>${content}</polygon>`;
	}
}
