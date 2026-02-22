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

	constructor(options: CircleOptions = {}) {
		this.cx = options.cx ?? 0;
		this.cy = options.cy ?? 0;
		this.r = options.r ?? 0;
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	toString(): string {
		let attrs = `cx="${this.cx}" cy="${this.cy}" r="${this.r}"`;
		if (this.fill !== undefined) attrs += ` fill="${this.fill}"`;
		if (this.stroke !== undefined) attrs += ` stroke="${this.stroke}"`;
		return `<circle ${attrs}/>`;
	}
}
