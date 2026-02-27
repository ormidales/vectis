import type { PresentationAttributes, Shape } from "../interfaces/shape.interface.js";
import { BaseShape } from "./base-shape.js";

/**
 * Options for constructing a {@link Group} element.
 */
export interface GroupOptions extends PresentationAttributes {}

/**
 * Represents an SVG `<g>` (group) element that can contain child shapes.
 *
 * Presentation attributes applied to the group (e.g. `fill`, `transform`) are
 * inherited by all children, following standard SVG inheritance rules.
 *
 * @example
 * const group = new Group({ fill: 'blue', transform: 'translate(10 20)' });
 * group.add(new Circle({ cx: 50, cy: 50, r: 25 }));
 * group.add(new Rect({ x: 10, y: 10, width: 80, height: 40 }));
 * group.toString();
 * // '<g fill="blue" transform="translate(10 20)"><circle .../><rect .../></g>'
 */
export class Group extends BaseShape {
	private readonly children: Shape[] = [];

	/**
	 * Creates a new group element.
	 *
	 * @param options - Presentation attributes to apply to the group.
	 */
	constructor(options: GroupOptions = {}) {
		super(options);
	}

	/**
	 * Appends a child shape to the group.
	 *
	 * @param shape - Any object implementing the {@link Shape} interface.
	 * @returns The group instance, enabling method chaining.
	 */
	add(shape: Shape): this {
		this.children.push(shape);
		return this;
	}

	/**
	 * Serializes the group to a `<g>` SVG element string containing all children.
	 *
	 * @returns SVG `<g>` element string.
	 */
	toString(): string {
		const attrs = this.renderPresentationAttrs();
		const content = this.children.map((child) => child.toString()).join("");
		return `<g${attrs}>${content}</g>`;
	}
}
