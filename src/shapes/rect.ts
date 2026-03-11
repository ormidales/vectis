import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

/**
 * Options for constructing a {@link Rect} element.
 */
export interface RectOptions extends PresentationAttributes {
	/** X-coordinate of the rectangle's top-left corner. `NaN` and non-finite values are normalized to `0`. Defaults to `0`. */
	x?: number;
	/** Y-coordinate of the rectangle's top-left corner. `NaN` and non-finite values are normalized to `0`. Defaults to `0`. */
	y?: number;
	/** Width of the rectangle. Must be `>= 0`. Negative, `NaN`, and non-finite values are clamped to `0`. Defaults to `0`. */
	width?: number;
	/** Height of the rectangle. Must be `>= 0`. Negative, `NaN`, and non-finite values are clamped to `0`. Defaults to `0`. */
	height?: number;
}

/**
 * Represents an SVG `<rect>` element.
 *
 * @example
 * new Rect({ x: 10, y: 10, width: 80, height: 60, fill: 'green' }).toString();
 * // '<rect x="10" y="10" width="80" height="60" fill="green"/>'
 */
export class Rect extends BaseShape {
	private readonly x: number;
	private readonly y: number;
	private readonly width: number;
	private readonly height: number;

	/**
	 * Creates a new rectangle shape.
	 *
	 * @param options - Rectangle geometry and presentation options.
	 */
	constructor(options: RectOptions = {}) {
		super(options);
		const x = options.x ?? 0;
		const y = options.y ?? 0;
		this.x = Number.isFinite(x) ? x : 0;
		this.y = Number.isFinite(y) ? y : 0;
		const w = options.width ?? 0;
		const h = options.height ?? 0;
		this.width = Number.isFinite(w) ? Math.max(0, w) : 0;
		this.height = Number.isFinite(h) ? Math.max(0, h) : 0;
	}

	/**
	 * Gets the x-coordinate of the rectangle's top-left corner.
	 *
	 * @returns The x-coordinate of the rectangle's top-left corner.
	 */
	getX(): number {
		return this.x;
	}

	/**
	 * Gets the y-coordinate of the rectangle's top-left corner.
	 *
	 * @returns The y-coordinate of the rectangle's top-left corner.
	 */
	getY(): number {
		return this.y;
	}

	/**
	 * Gets the width of the rectangle.
	 *
	 * @returns The width of the rectangle.
	 */
	getWidth(): number {
		return this.width;
	}

	/**
	 * Gets the height of the rectangle.
	 *
	 * @returns The height of the rectangle.
	 */
	getHeight(): number {
		return this.height;
	}

	/**
	 * Serializes the rectangle to a `<rect>` SVG element string.
	 *
	 * @returns SVG `<rect>` element string.
	 */
	toString(): string {
		return this.renderElement(
			"rect",
			`x="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}"`,
		);
	}
}
