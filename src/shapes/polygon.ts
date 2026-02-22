import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";

export interface PolygonOptions extends PresentationAttributes {
	points?: string;
}

export class Polygon implements Shape {
	private readonly points: string;
	private readonly fill: string | undefined;
	private readonly stroke: string | undefined;

	constructor(options: PolygonOptions = {}) {
		this.points = options.points ?? "";
		this.fill = options.fill;
		this.stroke = options.stroke;
	}

	toString(): string {
		let attrs = `points="${this.points}"`;
		if (this.fill !== undefined) attrs += ` fill="${this.fill}"`;
		if (this.stroke !== undefined) attrs += ` stroke="${this.stroke}"`;
		return `<polygon ${attrs}/>`;
	}
}
