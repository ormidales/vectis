import {
	renderSmilAnimation,
	type SmilAnimationOptions,
} from "../animation/smil.js";
import type {
	PresentationAttributes,
	Shape,
} from "../interfaces/shape.interface.js";
import { escapeXml } from "../utils/escape.js";

/**
 * Abstract base class for all SVG shape elements.
 *
 * Centralizes presentation attributes (`fill`, `stroke`, etc.) and SMIL animation
 * handling. Concrete shapes extend this class and implement {@link toString}.
 */
export abstract class BaseShape implements Shape {
	protected readonly id: string | undefined;
	protected readonly fill: string | undefined;
	protected readonly stroke: string | undefined;
	protected readonly strokeWidth: number | undefined;
	protected readonly opacity: number | undefined;
	private readonly animations: SmilAnimationOptions[] = [];

	/**
	 * Creates a new shape with the given presentation attributes.
	 *
	 * @param options - Optional presentation attributes (`fill`, `stroke`, etc.).
	 */
	constructor(options: PresentationAttributes = {}) {
		this.id = options.id;
		this.fill = options.fill;
		this.stroke = options.stroke;
		this.strokeWidth = options.strokeWidth;
		this.opacity = options.opacity;
	}

	/**
	 * Attaches a SMIL animation to this shape.
	 *
	 * Multiple calls can be chained to add several animations.
	 *
	 * @param options - Animation configuration.
	 * @returns The shape instance for method chaining.
	 */
	animate(options: SmilAnimationOptions): this {
		this.animations.push(options);
		return this;
	}

	/**
	 * Builds a string of SVG presentation attributes from the stored options.
	 *
	 * @returns A partial attribute string (leading space included), e.g. ` fill="red" opacity="0.5"`.
	 */
	protected renderPresentationAttrs(): string {
		let attrs = "";
		if (this.id !== undefined) attrs += ` id="${escapeXml(this.id)}"`;
		if (this.fill !== undefined) attrs += ` fill="${escapeXml(this.fill)}"`;
		if (this.stroke !== undefined)
			attrs += ` stroke="${escapeXml(this.stroke)}"`;
		if (this.strokeWidth !== undefined)
			attrs += ` stroke-width="${this.strokeWidth}"`;
		if (this.opacity !== undefined) attrs += ` opacity="${this.opacity}"`;
		return attrs;
	}

	/**
	 * Builds the full SVG element string, combining geometric and presentation attributes
	 * and embedding any attached SMIL animation children.
	 *
	 * @param tag - The SVG element tag name (e.g. `"circle"`, `"rect"`).
	 * @param geometricAttrs - Pre-built string of geometric attributes (e.g. `cx="0" cy="0" r="5"`).
	 * @returns A self-closing element string when no animations are present, or an open/close
	 *   pair with animation children otherwise.
	 */
	protected renderElement(tag: string, geometricAttrs: string): string {
		const attrs = geometricAttrs + this.renderPresentationAttrs();
		if (this.animations.length === 0) return `<${tag} ${attrs}/>`;
		const content = this.animations.map(renderSmilAnimation).join("");
		return `<${tag} ${attrs}>${content}</${tag}>`;
	}

	/**
	 * Serializes this shape to an SVG element string.
	 *
	 * @returns A valid SVG element string.
	 */
	abstract toString(): string;
}
