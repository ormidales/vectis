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
export function validatePathData(d: string): void {
	// Skip validation for empty strings or strings containing only whitespace
	if (d.trim() === "") {
		return;
	}

	// Basic validation: check if the path data starts with a valid SVG path command
	// Valid commands: M, m, L, l, H, h, V, v, C, c, S, s, Q, q, T, t, A, a, Z, z
	const validCommandPattern = /^\s*[MmLlHhVvCcSsQqTtAaZz]/;

	if (!validCommandPattern.test(d)) {
		console.warn(
			`[vectis] Invalid path data: "${d}". Path data should start with a valid SVG command (M, L, H, V, C, S, Q, T, A, or Z). The SVG may not render correctly.`,
		);
		return;
	}

	// Additional validation: check for illegal characters anywhere in the path data
	// Valid characters are: SVG command letters, digits, whitespace, numeric separators (.,+-),
	// and exponent indicators (eE) for scientific notation (e.g. 1e-5)
	const illegalCharPattern = /[^MmLlHhVvCcSsQqTtAaZzeE\d\s.,+\-]/;

	if (illegalCharPattern.test(d)) {
		console.warn(
			`[vectis] Invalid path data: "${d}". Path data contains illegal characters. Only SVG path commands and numeric values are allowed. The SVG may not render correctly.`,
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
	 * Gets the SVG path data string.
	 *
	 * @returns The SVG path data string.
	 */
	getD(): string {
		return this.d;
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
