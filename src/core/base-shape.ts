import {
	renderSmilAnimation,
	type SmilAnimationOptions,
} from "../animation/smil.js";
import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export abstract class BaseShape implements Shape {
	protected readonly id: string | undefined;
	protected readonly fill: string | undefined;
	protected readonly stroke: string | undefined;
	protected readonly strokeWidth: number | undefined;
	protected readonly opacity: number | undefined;
	private readonly animations: SmilAnimationOptions[] = [];

	constructor(options: PresentationAttributes = {}) {
		this.id = options.id;
		this.fill = options.fill;
		this.stroke = options.stroke;
		this.strokeWidth = options.strokeWidth;
		this.opacity = options.opacity;
	}

	animate(options: SmilAnimationOptions): this {
		this.animations.push(options);
		return this;
	}

	protected renderPresentationAttrs(): string {
		let attrs = "";
		if (this.id !== undefined) attrs += ` id="${escapeXml(this.id)}"`;
		if (this.fill !== undefined) attrs += ` fill="${escapeXml(this.fill)}"`;
		if (this.stroke !== undefined)
			attrs += ` stroke="${escapeXml(this.stroke)}"`;
		if (this.strokeWidth !== undefined)
			attrs += ` stroke-width="${this.strokeWidth}"`;
		if (this.opacity !== undefined) attrs += ` opacity="${this.opacity}"`;
		return attrs;
	}

	protected renderElement(tag: string, geometricAttrs: string): string {
		const attrs = geometricAttrs + this.renderPresentationAttrs();
		if (this.animations.length === 0) return `<${tag} ${attrs}/>`;
		const content = this.animations.map(renderSmilAnimation).join("");
		return `<${tag} ${attrs}>${content}</${tag}>`;
	}

	abstract toString(): string;
}
