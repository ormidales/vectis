import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

export interface RectOptions extends PresentationAttributes {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

export class Rect extends BaseShape {
	private readonly x: number;
	private readonly y: number;
	private readonly width: number;
	private readonly height: number;

	constructor(options: RectOptions = {}) {
		super(options);
		this.x = options.x ?? 0;
		this.y = options.y ?? 0;
		this.width = options.width ?? 0;
		this.height = options.height ?? 0;
	}

	toString(): string {
		return this.renderElement(
			"rect",
			`x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}"`,
		);
	}
}
