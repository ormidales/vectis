import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

/**
 * Options for constructing a {@link Polygon} element.
 */
export interface PolygonOptions extends PresentationAttributes {
	/**
	 * Space- or comma-separated list of coordinate pairs defining the polygon vertices
	 * (e.g. `"0,0 50,100 100,0"`). Defaults to an empty string.
	 */
	points?: string;
}

/**
 * Represents an SVG `<polygon>` element.
 *
 * @example
 * new Polygon({ points: '0,0 50,100 100,0', fill: 'orange' }).toString();
 * // '<polygon points="0,0 50,100 100,0" fill="orange"/>'
 */
export class Polygon extends BaseShape {
	private readonly points: string;

	/**
	 * Creates a new polygon shape.
	 *
	 * @param options - Polygon vertices and presentation options.
	 */
	constructor(options: PolygonOptions = {}) {
		super(options);
		this.points = options.points ?? "";
	}

	/**
	 * Gets the polygon vertices as a space- or comma-separated list of coordinate pairs.
	 *
	 * @returns The polygon vertices string.
	 */
	getPoints(): string {
		return this.points;
	}

	/**
	 * Serializes the polygon to a `<polygon>` SVG element string.
	 *
	 * @returns SVG `<polygon>` element string.
	 */
	toString(): string {
		const pointsAttr = this.points === "" ? "" : `points="${escapeXml(this.points)}"`;
		return this.renderElement("polygon", pointsAttr);
	}
}
