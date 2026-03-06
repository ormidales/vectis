import type { SmilAnimationOptions } from "../animation/smil.js";

/**
 * Valid values for the SVG `opacity` presentation attribute.
 * Accepts a unitless number, a numeric string, or a percentage string.
 *
 * @example 0.5, "0.5", "50%"
 */
export type OpacityValue = number | `${number}` | `${number}%`;

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
	/** Opacity of the element, from `0` (transparent) to `1` (opaque). Also accepts percentage strings (e.g. `"50%"`). */
	opacity?: OpacityValue;
	/** Static transform attribute (e.g. `"rotate(45)"`, `"translate(10 20)"`). */
	transform?: string;
	/** Inline CSS styles for the element (`style` attribute). */
	style?: string;
	/** ARIA role attribute for accessibility (e.g. `"button"`, `"img"`). */
	role?: string;
	/** ARIA label providing an accessible name for the element. */
	ariaLabel?: string;
	/** ID reference to another element that labels this element (`aria-labelledby` attribute). */
	ariaLabelledby?: string;
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
	 * Removes all attached SMIL animations from the shape.
	 *
	 * @returns The shape instance, enabling method chaining.
	 */
	clearAnimations(): this;

	/**
	 * Serializes the shape to an SVG markup string.
	 *
	 * @returns A valid SVG element string (e.g. `<circle cx="0" cy="0" r="5"/>`).
	 */
	toString(): string;
}
