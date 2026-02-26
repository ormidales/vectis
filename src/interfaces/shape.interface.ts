import type { SmilAnimationOptions } from "../animation/smil.js";

/**
 * Common SVG presentation attributes shared by all shape elements.
 */
export interface PresentationAttributes {
	/** Unique identifier for the SVG element (`id` attribute). */
	id?: string;
	/** CSS class name(s) for the element (`class` attribute). */
	className?: string;
	/** Fill color of the shape (e.g. `"red"`, `"#ff0000"`). */
	fill?: string;
	/** Stroke color of the shape outline. */
	stroke?: string;
	/** Width of the stroke in user units. */
	strokeWidth?: number;
	/** Shape of the end caps for open subpaths (`stroke-linecap` attribute). */
	strokeLinecap?: "butt" | "round" | "square";
	/** Shape of the corners where two lines meet (`stroke-linejoin` attribute). */
	strokeLinejoin?: "miter" | "round" | "bevel";
	/** Opacity of the element, from `0` (transparent) to `1` (opaque). */
	opacity?: number;
	/** Static transform attribute (e.g. `"rotate(45)"`, `"translate(10 20)"`). */
	transform?: string;
}

/**
 * Contract that all renderable SVG shape objects must satisfy.
 */
export interface Shape {
	/**
	 * Attaches a SMIL animation to the shape.
	 *
	 * @param options - Animation configuration (attribute, timing, values…).
	 * @returns The shape instance, enabling method chaining.
	 */
	animate(options: SmilAnimationOptions): this;

	/**
	 * Serializes the shape to an SVG markup string.
	 *
	 * @returns A valid SVG element string (e.g. `<circle cx="0" cy="0" r="5"/>`).
	 */
	toString(): string;
}
