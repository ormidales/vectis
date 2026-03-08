import type { Shape } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

/**
 * Configuration options for {@link SvgCanvas}.
 */
export interface SvgCanvasOptions {
	/**
	 * Width of the SVG viewport. Accepts a number (user units) or a CSS string
	 * such as `"100%"`, `"50em"`. Defaults to `300`.
	 */
	width?: number | string;
	/**
	 * Height of the SVG viewport. Accepts a number (user units) or a CSS string
	 * such as `"100%"`, `"50em"`. Defaults to `150`.
	 */
	height?: number | string;
	/**
	 * Value of the `viewBox` attribute (e.g. `"0 0 300 150"`).
	 * Inferred from `width`/`height` when both are numbers and omitted.
	 */
	viewBox?: string;
	/**
	 * Additional XML namespaces to declare on the root `<svg>` element.
	 * Each key becomes the namespace prefix and each value the namespace URI.
	 *
	 * @example
	 * // Adds xmlns:xlink="http://www.w3.org/1999/xlink"
	 * { xlink: "http://www.w3.org/1999/xlink" }
	 */
	namespaces?: Record<string, string>;
}

/**
 * Checks whether a string is a valid XML namespace prefix (NCName).
 * Prefixes must be non-empty, start with a letter or underscore, contain only
 * letters, digits, hyphens, underscores and dots, and must not be the reserved
 * tokens `xml` or `xmlns`.
 *
 * @param prefix - The candidate namespace prefix.
 * @returns `true` when the prefix is a valid NCName that may be used as a namespace prefix.
 */
function isValidNcName(prefix: string): boolean {
	if (prefix === "xml" || prefix === "xmlns") {
		return false;
	}
	return /^[A-Za-z_][A-Za-z0-9_\-.]*$/.test(prefix);
}

/**
 * Validates SVG viewBox string.
 * Logs a warning if the viewBox format appears invalid.
 *
 * @param viewBox - The viewBox string to validate.
 */
function validateViewBox(viewBox: string): void {
	// The viewBox attribute should contain 4 numeric values: min-x min-y width height
	// Valid examples: "0 0 300 150", "-10 -10 100 100", "0.5 0.5 99.5 99.5", "0, 0, 300, 150", "0 0 1e-4 1e-4", ".5 .5 100 100", "0 0 +1e4 1e4"
	const num = "[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?";
	const sep = "(?:\\s*,\\s*|\\s+)";
	const validViewBoxPattern = new RegExp(`^\\s*${num}${sep}${num}${sep}${num}${sep}${num}\\s*$`);

	if (!validViewBoxPattern.test(viewBox)) {
		console.warn(
			`[vectis] Invalid viewBox format: "${viewBox}". ViewBox should contain 4 numeric values (min-x min-y width height), e.g., "0 0 300 150". The SVG may not render correctly.`,
		);
		return;
	}

	const values = [...viewBox.matchAll(new RegExp(num, "g"))].map((m) => Number(m[0]));
	const width = values[2];
	const height = values[3];

	if (width <= 0) {
		console.warn(
			`[vectis] Invalid viewBox: width must be strictly positive, got ${width}. The SVG may not render correctly.`,
		);
	}
	if (height <= 0) {
		console.warn(
			`[vectis] Invalid viewBox: height must be strictly positive, got ${height}. The SVG may not render correctly.`,
		);
	}
}

/**
 * Root SVG canvas that holds shape children and serialises them to an SVG string.
 *
 * @example
 * const canvas = new SvgCanvas({ width: 200, height: 200 });
 * canvas.add(new Circle({ cx: 100, cy: 100, r: 50 }));
 * console.log(canvas.toString());
 */
export class SvgCanvas {
	private readonly width: number | string;
	private readonly height: number | string;
	private readonly viewBox: string;
	private readonly extraNs: string;
	private readonly children: Shape[] = [];

	/**
	 * Creates a new SVG canvas.
	 *
	 * @param options - Optional canvas configuration. Defaults to `300×150` with a matching viewBox.
	 */
	constructor(options: SvgCanvasOptions = {}) {
		this.width = options.width ?? 300;
		this.height = options.height ?? 150;
		const vbWidth = typeof this.width === "number" ? this.width : 300;
		const vbHeight = typeof this.height === "number" ? this.height : 150;
		this.viewBox = options.viewBox ?? `0 0 ${vbWidth} ${vbHeight}`;
		this.extraNs = Object.entries(options.namespaces ?? {})
			.filter(([prefix]) => {
				if (!isValidNcName(prefix)) {
					console.warn(
						`[vectis] Invalid namespace prefix: "${prefix}". Prefixes must be a valid XML NCName (non-empty, start with a letter or underscore, no colons) and must not be "xml" or "xmlns". The namespace declaration will be skipped.`,
					);
					return false;
				}
				return true;
			})
			.map(([prefix, uri]) => ` xmlns:${prefix}="${escapeXml(uri)}"`)
			.join("");
		validateViewBox(this.viewBox);
	}

	/**
	 * Appends a shape to the canvas.
	 *
	 * @param shape - Any object implementing the {@link Shape} interface.
	 * @returns The canvas instance, enabling method chaining.
	 */
	add(shape: Shape): this {
		this.children.push(shape);
		return this;
	}

	/**
	 * Serializes the canvas and all its children to a complete SVG string.
	 *
	 * @returns A full `<svg>` element string with all child shapes embedded.
	 */
	toString(): string {
		const content = this.children.map((child) => child.toString()).join("");
		const w = typeof this.width === "string" ? escapeXml(this.width) : this.width;
		const h = typeof this.height === "string" ? escapeXml(this.height) : this.height;
		return `<svg xmlns="http://www.w3.org/2000/svg"${this.extraNs} viewBox="${escapeXml(this.viewBox)}" width="${w}" height="${h}">${content}</svg>`;
	}
}
