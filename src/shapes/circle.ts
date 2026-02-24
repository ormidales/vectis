import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

export interface CircleOptions extends PresentationAttributes {
	cx?: number;
	cy?: number;
	r?: number;
}

export class Circle extends BaseShape {
	private readonly cx: number;
	private readonly cy: number;
	private readonly r: number;

	constructor(options: CircleOptions = {}) {
		super(options);
		this.cx = options.cx ?? 0;
		this.cy = options.cy ?? 0;
		this.r = options.r ?? 0;
	}

	toString(): string {
		return this.renderElement(
			"circle",
			`cx="${this.cx}" cy="${this.cy}" r="${this.r}"`,
		);
	}
}
