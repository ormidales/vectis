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
	/**
	 * When `true`, skips the automatic call to {@link validatePolygonPoints} in the
	 * constructor. Use this when you manage points validity yourself or when you want
	 * to suppress validation warnings (e.g. in unit tests or during incremental
	 * programmatic polygon construction).
	 *
	 * @default false
	 */
	skipValidation?: boolean;
}

/**
 * Validates a polygon `points` attribute string.
 * Logs a warning if the value does not consist of valid coordinate pairs.
 *
 * @param points - The polygon points string to validate.
 */
export function validatePolygonPoints(points: string): void {
	if (points.trim() === "") {
		return;
	}

	// Matches one or more coordinate pairs: each pair is two numbers
	// (optionally signed, integer or decimal) separated by whitespace or a comma.
	// Pairs are separated by whitespace, commas, or a combination.
	const num = String.raw`[+-]?(?:\d+\.?\d*|\.\d+)`;
	const sep = String.raw`[\s,]+`;
	const validPattern = new RegExp(
		`^\\s*${num}${sep}${num}(?:${sep}${num}${sep}${num})*\\s*$`,
	);

	if (!validPattern.test(points)) {
		console.warn(
			`[vectis] Invalid polygon points: "${points}". Expected space- or comma-separated coordinate pairs (e.g. "0,0 50,100 100,0"). The SVG may not render correctly.`,
		);
	}
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
		if (!options.skipValidation) {
			validatePolygonPoints(this.points);
		}
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
		return this.renderElement("polygon", `points="${escapeXml(this.points)}"`);
	}
}
