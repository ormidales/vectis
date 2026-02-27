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
 * Validates SVG path data string.
 * Logs a warning if the path data appears invalid.
 *
 * @param d - The path data string to validate.
 */
function validatePathData(d: string): void {
	// Skip validation for empty strings
	if (d === "") {
		return;
	}

	// Basic validation: check if the path data starts with a valid SVG path command
	// Valid commands: M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z, z
	const validCommandPattern = /^\s*[MmLlHhVvCcSsQqTtAaZz]/;

	if (!validCommandPattern.test(d)) {
		console.warn(
			`[vectis] Invalid path data: "${d}". Path data should start with a valid SVG command (M, L, H, V, C, S, Q, T, A, or Z). The SVG may not render correctly.`,
		);
	}
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
		validatePathData(this.d);
	}

	/**
	 * Serializes the path to a `<path>` SVG element string.
	 *
	 * @returns SVG `<path>` element string.
	 */
	toString(): string {
		const dAttr = this.d === "" ? "" : `d="${escapeXml(this.d)}"`;
		return this.renderElement("path", dAttr);
	}
}
