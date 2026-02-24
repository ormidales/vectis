import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";

/**
 * Options for constructing a {@link Rect} element.
 */
export interface RectOptions extends PresentationAttributes {
	/** X-coordinate of the rectangle's top-left corner. Defaults to `0`. */
	x?: number;
	/** Y-coordinate of the rectangle's top-left corner. Defaults to `0`. */
	y?: number;
	/** Width of the rectangle. Defaults to `0`. */
	width?: number;
	/** Height of the rectangle. Defaults to `0`. */
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
		this.x = options.x ?? 0;
		this.y = options.y ?? 0;
		this.width = options.width ?? 0;
		this.height = options.height ?? 0;
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
