import type { PresentationAttributes, Shape } from "../interfaces/shape.interface.js";
import { BaseShape } from "./base-shape.js";

/**
 * Options for constructing a {@link Group} element.
 *
 * Inherits all {@link PresentationAttributes} such as `fill`, `stroke`, `opacity`,
 * and `transform`. These attributes are applied to the group's `<g>` element and
 * cascade down to all child shapes according to standard SVG inheritance rules.
 *
 * For example, setting `fill: 'blue'` on a group will make all children without
 * their own `fill` attribute render in blue. Similarly, a group-level `transform`
 * will be applied to the entire group's coordinate system, affecting all children.
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
	 * Removes a specific child shape from the group. No-op if the shape is not found.
	 *
	 * @param shape - The shape to remove.
	 * @returns The group instance, enabling method chaining.
	 */
	remove(shape: Shape): this {
		const idx = this.children.indexOf(shape);
		if (idx !== -1) this.children.splice(idx, 1);
		return this;
	}

	/**
	 * Removes all child shapes from the group.
	 *
	 * @returns The group instance, enabling method chaining.
	 */
	clear(): this {
		this.children.length = 0;
		return this;
	}

	/**
	 * Serializes the group to a `<g>` SVG element string containing all children.
	 *
	 * Emits a self-closing `<g .../>` tag when the group has no children, no `title`,
	 * and no attached SMIL animations; otherwise emits an open/close `<g ...>...</g>` pair.
	 *
	 * @remarks The self-closing decision is driven by the combined output of
	 *   {@link renderBaseChildren} (title + animations) and the direct children array.
	 *   A group with only a `title` or only animations will still emit an open/close tag.
	 *
	 * @returns SVG `<g>` element string.
	 */
	toString(): string {
		const attrs = this.renderPresentationAttrs();
		const baseContent = this.renderBaseChildren();
		const shapeContent = this.children.map((child) => child.toString()).join("");
		const content = baseContent + shapeContent;
		if (!content) return `<g${attrs}/>`;
		return `<g${attrs}>${content}</g>`;
	}
}
