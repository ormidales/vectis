import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";

export interface RectOptions extends PresentationAttributes {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}

export class Rect implements Shape {
	private readonly x: number;
	private readonly y: number;
	private readonly width: number;
	private readonly height: number;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;

	constructor(options: RectOptions = {}) {
		this.x = options.x ?? 0;
		this.y = options.y ?? 0;
		this.width = options.width ?? 0;
		this.height = options.height ?? 0;
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	toString(): string {
		let attrs = `x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}"`;
		if (this.fill !== undefined) attrs += ` fill="${this.fill}"`;
		if (this.stroke !== undefined) attrs += ` stroke="${this.stroke}"`;
		return `<rect ${attrs}/>`;
	}
}
