import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export interface PathOptions extends PresentationAttributes {
	d?: string;
}

export class Path extends BaseShape {
	private readonly d: string;

	constructor(options: PathOptions = {}) {
		super(options);
		this.d = options.d ?? "";
	}

	toString(): string {
		return this.renderElement("path", `d="${escapeXml(this.d)}"`);
	}
}
