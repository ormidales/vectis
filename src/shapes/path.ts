import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";

export interface PathOptions extends PresentationAttributes {
	d?: string;
}

export class Path implements Shape {
	private readonly d: string;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;

	constructor(options: PathOptions = {}) {
		this.d = options.d ?? "";
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	toString(): string {
		let attrs = `d="${this.d}"`;
		if (this.fill !== undefined) attrs += ` fill="${this.fill}"`;
		if (this.stroke !== undefined) attrs += ` stroke="${this.stroke}"`;
		return `<path ${attrs}/>`;
	}
}
