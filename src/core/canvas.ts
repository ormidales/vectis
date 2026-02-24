import type { Shape } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export interface SvgCanvasOptions {
	width?: number | string;
	height?: number | string;
	viewBox?: string;
}

export class SvgCanvas {
	private readonly width: number | string;
	private readonly height: number | string;
	private readonly viewBox: string;
	private readonly children: Shape[] = [];

	constructor(options: SvgCanvasOptions = {}) {
		this.width = options.width ?? 300;
		this.height = options.height ?? 150;
		const vbWidth = typeof this.width === "number" ? this.width : 300;
		const vbHeight = typeof this.height === "number" ? this.height : 150;
		this.viewBox = options.viewBox ?? `0 0 ${vbWidth} ${vbHeight}`;
	}

	add(shape: Shape): this {
		this.children.push(shape);
		return this;
	}

	toString(): string {
		const content = this.children.map((child) => child.toString()).join("");
		const w =
			typeof this.width === "string" ? escapeXml(this.width) : this.width;
		const h =
			typeof this.height === "string" ? escapeXml(this.height) : this.height;
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox}" width="${w}" height="${h}">${content}</svg>`;
	}
}
