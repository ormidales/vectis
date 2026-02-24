import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

/**
 * Options for constructing a {@link Path} element.
 */
export interface PathOptions extends PresentationAttributes {
	/**
	 * SVG path data string (e.g. `"M10 10 L90 90"`).
	 * Defaults to an empty string.
	 */
	d?: string;
}

/**
 * Represents an SVG `<path>` element.
 *
 * @example
 * new Path({ d: 'M10 10 L90 90', stroke: 'black' }).toString();
 * // '<path d="M10 10 L90 90" stroke="black"/>'
 */
export class Path extends BaseShape {
	private readonly d: string;

	/**
	 * Creates a new path shape.
	 *
	 * @param options - Path data and presentation options.
	 */
	constructor(options: PathOptions = {}) {
		super(options);
		this.d = options.d ?? "";
	}

	/**
	 * Serializes the path to a `<path>` SVG element string.
	 *
	 * @returns SVG `<path>` element string.
	 */
	toString(): string {
		return this.renderElement("path", `d="${escapeXml(this.d)}"`);
	}
}
