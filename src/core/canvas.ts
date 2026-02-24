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
		const w =
			typeof this.width === "string" ? escapeXml(this.width) : this.width;
		const h =
			typeof this.height === "string" ? escapeXml(this.height) : this.height;
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox}" width="${w}" height="${h}">${content}</svg>`;
	}
}
