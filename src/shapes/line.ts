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
	/** X-coordinate of the line start point. `NaN` and non-finite values are normalised to `0`. Defaults to `0`. */
	x1?: number;
	/** Y-coordinate of the line start point. `NaN` and non-finite values are normalised to `0`. Defaults to `0`. */
	y1?: number;
	/** X-coordinate of the line end point. `NaN` and non-finite values are normalised to `0`. Defaults to `0`. */
	x2?: number;
	/** Y-coordinate of the line end point. `NaN` and non-finite values are normalised to `0`. Defaults to `0`. */
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

	private static sanitizeCoord(v: number | undefined): number {
		const n = v ?? 0;
		return Number.isFinite(n) ? n : 0;
	}

	/**
	 * Creates a new line shape.
	 *
	 * @param options - Line geometry and presentation options.
	 */
	constructor(options: LineOptions = {}) {
		super(options);
		this.x1 = Line.sanitizeCoord(options.x1);
		this.y1 = Line.sanitizeCoord(options.y1);
		this.x2 = Line.sanitizeCoord(options.x2);
		this.y2 = Line.sanitizeCoord(options.y2);
	}

	/**
	 * Gets the x-coordinate of the line start point.
	 *
	 * @returns The x-coordinate of the line start point.
	 */
	getX1(): number {
		return this.x1;
	}

	/**
	 * Gets the y-coordinate of the line start point.
	 *
	 * @returns The y-coordinate of the line start point.
	 */
	getY1(): number {
		return this.y1;
	}

	/**
	 * Gets the x-coordinate of the line end point.
	 *
	 * @returns The x-coordinate of the line end point.
	 */
	getX2(): number {
		return this.x2;
	}

	/**
	 * Gets the y-coordinate of the line end point.
	 *
	 * @returns The y-coordinate of the line end point.
	 */
	getY2(): number {
		return this.y2;
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
