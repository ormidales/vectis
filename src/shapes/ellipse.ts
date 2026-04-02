import { BaseShape } from "../core/base-shape.js";
import type { EllipseShape, PresentationAttributes } from "../interfaces/shape.interface.js";
import { sanitizeNumber } from "../utils/sanitize-number.js";

/**
 * Options for constructing an {@link Ellipse} element.
 */
export interface EllipseOptions extends PresentationAttributes {
	/** X-coordinate of the ellipse centre. Defaults to `0`. */
	cx?: number;
	/** Y-coordinate of the ellipse centre. Defaults to `0`. */
	cy?: number;
	/** Horizontal radius of the ellipse. Must be `>= 0`. Negative, `NaN`, and non-finite values are clamped to `0`. Defaults to `0`. */
	rx?: number;
	/** Vertical radius of the ellipse. Must be `>= 0`. Negative, `NaN`, and non-finite values are clamped to `0`. Defaults to `0`. */
	ry?: number;
}

/**
 * Represents an SVG `<ellipse>` element.
 *
 * @example
 * new Ellipse({ cx: 50, cy: 50, rx: 40, ry: 25, fill: 'blue' }).toString();
 * // '<ellipse cx="50" cy="50" rx="40" ry="25" fill="blue"/>'
 */
export class Ellipse extends BaseShape implements EllipseShape {
	private readonly cx: number;
	private readonly cy: number;
	private readonly rx: number;
	private readonly ry: number;

	/**
	 * Creates a new ellipse shape.
	 *
	 * @param options - Ellipse geometry and presentation options.
	 */
	constructor(options: EllipseOptions = {}) {
		super(options);
		this.cx = sanitizeNumber(options.cx);
		this.cy = sanitizeNumber(options.cy);
		this.rx = Math.max(0, sanitizeNumber(options.rx));
		this.ry = Math.max(0, sanitizeNumber(options.ry));
	}

	/**
	 * Gets the x-coordinate of the ellipse centre.
	 *
	 * @returns The x-coordinate of the ellipse centre.
	 */
	getCx(): number {
		return this.cx;
	}

	/**
	 * Gets the y-coordinate of the ellipse centre.
	 *
	 * @returns The y-coordinate of the ellipse centre.
	 */
	getCy(): number {
		return this.cy;
	}

	/**
	 * Gets the horizontal radius of the ellipse.
	 *
	 * @returns The horizontal radius of the ellipse.
	 */
	getRx(): number {
		return this.rx;
	}

	/**
	 * Gets the vertical radius of the ellipse.
	 *
	 * @returns The vertical radius of the ellipse.
	 */
	getRy(): number {
		return this.ry;
	}

	/**
	 * Serializes the ellipse to an `<ellipse>` SVG element string.
	 *
	 * @returns SVG `<ellipse>` element string.
	 */
	toString(): string {
		return this.renderElement(
			"ellipse",
			`cx="${this.cx}" cy="${this.cy}" rx="${this.rx}" ry="${this.ry}"`,
		);
	}
}
