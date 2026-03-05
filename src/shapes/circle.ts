import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

/**
 * Options for constructing a {@link Circle} element.
 */
export interface CircleOptions extends PresentationAttributes {
	/** X-coordinate of the circle centre. Defaults to `0`. */
	cx?: number;
	/** Y-coordinate of the circle centre. Defaults to `0`. */
	cy?: number;
	/** Radius of the circle. Must be `>= 0`. Negative, `NaN`, and non-finite values are clamped to `0`. Defaults to `0`. */
	r?: number;
}

/**
 * Represents an SVG `<circle>` element.
 *
 * @example
 * new Circle({ cx: 50, cy: 50, r: 25, fill: 'blue' }).toString();
 * // '<circle cx="50" cy="50" r="25" fill="blue"/>'
 */
export class Circle extends BaseShape {
	private readonly cx: number;
	private readonly cy: number;
	private readonly r: number;

	/**
	 * Creates a new circle shape.
	 *
	 * @param options - Circle geometry and presentation options.
	 */
	constructor(options: CircleOptions = {}) {
		super(options);
		this.cx = options.cx ?? 0;
		this.cy = options.cy ?? 0;
		const r = options.r ?? 0;
		this.r = Number.isFinite(r) ? Math.max(0, r) : 0;
	}

	/**
	 * Gets the x-coordinate of the circle centre.
	 *
	 * @returns The x-coordinate of the circle centre.
	 */
	getCx(): number {
		return this.cx;
	}

	/**
	 * Gets the y-coordinate of the circle centre.
	 *
	 * @returns The y-coordinate of the circle centre.
	 */
	getCy(): number {
		return this.cy;
	}

	/**
	 * Gets the radius of the circle.
	 *
	 * @returns The radius of the circle.
	 */
	getR(): number {
		return this.r;
	}

	/**
	 * Serializes the circle to a `<circle>` SVG element string.
	 *
	 * @returns SVG `<circle>` element string.
	 */
	toString(): string {
		return this.renderElement("circle", `cx="${this.cx}" cy="${this.cy}" r="${this.r}"`);
	}
}
