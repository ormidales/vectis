import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

/**
 * Options for constructing a {@link Line} element.
 *
 * A line is defined by two points in the SVG coordinate system: a start point
 * `(x1, y1)` and an end point `(x2, y2)`. The SVG coordinate system places the
 * origin `(0, 0)` at the top-left corner, with the positive x-axis extending to
 * the right and the positive y-axis extending downward.
 *
 * All coordinate properties are optional and default to `0` if omitted. For example,
 * if only `x2` and `y2` are provided, the line will be drawn from the origin `(0, 0)`
 * to the specified end point.
 */
export interface LineOptions extends PresentationAttributes {
	/** X-coordinate of the line start point. Defaults to `0`. */
	x1?: number;
	/** Y-coordinate of the line start point. Defaults to `0`. */
	y1?: number;
	/** X-coordinate of the line end point. Defaults to `0`. */
	x2?: number;
	/** Y-coordinate of the line end point. Defaults to `0`. */
	y2?: number;
}

/**
 * Represents an SVG `<line>` element.
 *
 * @example
 * new Line({ x1: 10, y1: 10, x2: 90, y2: 90, stroke: 'black' }).toString();
 * // '<line x1="10" y1="10" x2="90" y2="90" stroke="black"/>'
 */
export class Line extends BaseShape {
	private readonly x1: number;
	private readonly y1: number;
	private readonly x2: number;
	private readonly y2: number;

	/**
	 * Creates a new line shape.
	 *
	 * @param options - Line geometry and presentation options.
	 */
	constructor(options: LineOptions = {}) {
		super(options);
		this.x1 = options.x1 ?? 0;
		this.y1 = options.y1 ?? 0;
		this.x2 = options.x2 ?? 0;
		this.y2 = options.y2 ?? 0;
	}

	/**
	 * Serializes the line to a `<line>` SVG element string.
	 *
	 * @returns SVG `<line>` element string.
	 */
	toString(): string {
		return this.renderElement(
			"line",
			`x1="${this.x1}" y1="${this.y1}" x2="${this.x2}" y2="${this.y2}"`,
		);
	}
}
