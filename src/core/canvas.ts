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
}

/**
 * Validates SVG viewBox string.
 * Logs a warning if the viewBox format appears invalid.
 *
 * @param viewBox - The viewBox string to validate.
 */
function validateViewBox(viewBox: string): void {
	// The viewBox attribute should contain 4 numeric values: min-x min-y width height
	// Valid examples: "0 0 300 150", "-10 -10 100 100", "0.5 0.5 99.5 99.5"
	const validViewBoxPattern =
		/^\s*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*$/;

	if (!validViewBoxPattern.test(viewBox)) {
		console.warn(
			`[vectis] Invalid viewBox format: "${viewBox}". ViewBox should contain 4 numeric values (min-x min-y width height), e.g., "0 0 300 150". The SVG may not render correctly.`,
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
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escapeXml(this.viewBox)}" width="${w}" height="${h}">${content}</svg>`;
	}
}
