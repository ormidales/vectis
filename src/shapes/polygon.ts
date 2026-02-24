import { BaseShape } from "../core/base-shape.js";
import type { PresentationAttributes } from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

export interface PolygonOptions extends PresentationAttributes {
	points?: string;
}

export class Polygon extends BaseShape {
	private readonly points: string;

	constructor(options: PolygonOptions = {}) {
		super(options);
		this.points = options.points ?? "";
	}

	toString(): string {
		return this.renderElement("polygon", `points="${escapeXml(this.points)}"`);
	}
}
