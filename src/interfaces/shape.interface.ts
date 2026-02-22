import type { SmilAnimationOptions } from "../animation/smil.js";

export interface PresentationAttributes {
	fill?: string;
	stroke?: string;
	strokeWidth?: number;
	opacity?: number;
}

export interface Shape {
	animate(options: SmilAnimationOptions): this;
	toString(): string;
}
