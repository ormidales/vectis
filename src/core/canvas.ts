import type { Shape } from "../interfaces/shape.interface.js";

export interface SvgCanvasOptions {
	width?: number;
	height?: number;
	viewBox?: string;
}

export class SvgCanvas {
	private readonly width: number;
	private readonly height: number;
	private readonly viewBox: string;
	private readonly children: Shape[] = [];

	constructor(options: SvgCanvasOptions = {}) {
		this.width = options.width ?? 300;
		this.height = options.height ?? 150;
		this.viewBox = options.viewBox ?? `0 0 ${this.width} ${this.height}`;
	}

	add(shape: Shape): this {
		this.children.push(shape);
		return this;
	}

	toString(): string {
		const content = this.children.map((child) => child.toString()).join("");
		return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox}" width="${this.width}" height="${this.height}">${content}</svg>`;
	}
}
