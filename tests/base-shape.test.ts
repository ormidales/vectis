import { describe, expect, it } from "vitest";
import { BaseShape } from "../src/core/base-shape.js";
import type { PresentationAttributes } from "../src/interfaces/shape.interface.js";

/**
 * Mock implementation of BaseShape for testing purposes.
 * Provides a minimal concrete implementation to test the abstract class behavior.
 */
class MockShape extends BaseShape {
	private readonly testAttr: string;

	constructor(options: PresentationAttributes & { testAttr?: string } = {}) {
		super(options);
		this.testAttr = options.testAttr ?? "default";
	}

	toString(): string {
		return this.renderElement("mock", `test="${this.testAttr}"`);
	}
}

describe("BaseShape", () => {
	describe("Constructor and presentation attributes", () => {
		it("should create a shape with no presentation attributes", () => {
			const shape = new MockShape();
			const output = shape.toString();

			expect(output).toBe('<mock test="default"/>');
		});

		it("should include id attribute when specified", () => {
			const shape = new MockShape({ id: "test-id" });
			const output = shape.toString();

			expect(output).toContain('id="test-id"');
		});

		it("should include className attribute when specified", () => {
			const shape = new MockShape({ className: "test-class" });
			const output = shape.toString();

			expect(output).toContain('class="test-class"');
		});

		it("should include fill attribute when specified", () => {
			const shape = new MockShape({ fill: "red" });
			const output = shape.toString();

			expect(output).toContain('fill="red"');
		});

		it("should include stroke attribute when specified", () => {
			const shape = new MockShape({ stroke: "blue" });
			const output = shape.toString();

			expect(output).toContain('stroke="blue"');
		});

		it("should include strokeWidth attribute when specified", () => {
			const shape = new MockShape({ strokeWidth: 2 });
			const output = shape.toString();

			expect(output).toContain('stroke-width="2"');
		});

		it("should include strokeLinecap attribute when specified", () => {
			const shape = new MockShape({ strokeLinecap: "round" });
			const output = shape.toString();

			expect(output).toContain('stroke-linecap="round"');
		});

		it("should include strokeLinejoin attribute when specified", () => {
			const shape = new MockShape({ strokeLinejoin: "bevel" });
			const output = shape.toString();

			expect(output).toContain('stroke-linejoin="bevel"');
		});

		it("should include opacity attribute when specified", () => {
			const shape = new MockShape({ opacity: 0.5 });
			const output = shape.toString();

			expect(output).toContain('opacity="0.5"');
		});

		it("should include opacity attribute when specified as a percentage string", () => {
			const shape = new MockShape({ opacity: "50%" });
			const output = shape.toString();

			expect(output).toContain('opacity="50%"');
		});

		it("should include transform attribute when specified", () => {
			const shape = new MockShape({ transform: "rotate(45)" });
			const output = shape.toString();

			expect(output).toContain('transform="rotate(45)"');
		});

		it("should include style attribute when specified", () => {
			const shape = new MockShape({ style: "mix-blend-mode: multiply;" });
			const output = shape.toString();

			expect(output).toContain('style="mix-blend-mode: multiply;"');
		});

		it("should not include style attribute when not specified", () => {
			const shape = new MockShape();
			const output = shape.toString();

			expect(output).not.toContain("style=");
		});

		it("should not include style attribute when whitespace-only", () => {
			const shape = new MockShape({ style: "   " });
			const output = shape.toString();

			expect(output).not.toContain("style=");
		});

		it("should escape special characters in style to prevent XSS", () => {
			const shape = new MockShape({ style: '"onload="alert(1)' });
			const output = shape.toString();

			expect(output).not.toContain('"onload="alert(1)"');
			expect(output).toContain("&quot;");
		});

		it("should include role attribute when specified", () => {
			const shape = new MockShape({ role: "button" });
			const output = shape.toString();

			expect(output).toContain('role="button"');
		});

		it("should include ariaLabel attribute when specified", () => {
			const shape = new MockShape({ ariaLabel: "Bouton" });
			const output = shape.toString();

			expect(output).toContain('aria-label="Bouton"');
		});

		it("should include ariaLabelledby attribute when specified", () => {
			const shape = new MockShape({ ariaLabelledby: "label-id" });
			const output = shape.toString();

			expect(output).toContain('aria-labelledby="label-id"');
		});

		it("should not include transform attribute when whitespace-only", () => {
			const shape = new MockShape({ transform: "   " });
			const output = shape.toString();

			expect(output).not.toContain("transform");
		});

		it("should include multiple presentation attributes", () => {
			const shape = new MockShape({
				id: "multi-test",
				className: "styled",
				fill: "green",
				stroke: "black",
				strokeWidth: 3,
				opacity: 0.8,
			});
			const output = shape.toString();

			expect(output).toContain('id="multi-test"');
			expect(output).toContain('class="styled"');
			expect(output).toContain('fill="green"');
			expect(output).toContain('stroke="black"');
			expect(output).toContain('stroke-width="3"');
			expect(output).toContain('opacity="0.8"');
		});

		it("should escape special characters in id to prevent XSS", () => {
			const shape = new MockShape({ id: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in className to prevent XSS", () => {
			const shape = new MockShape({ className: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in fill to prevent XSS", () => {
			const shape = new MockShape({ fill: 'red" onload="alert(1)' });
			const output = shape.toString();

			expect(output).not.toContain('"red" onload="alert(1)"');
			expect(output).toContain("&quot;");
		});

		it("should escape special characters in stroke to prevent XSS", () => {
			const shape = new MockShape({ stroke: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in transform to prevent XSS", () => {
			const shape = new MockShape({ transform: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in role to prevent XSS", () => {
			const shape = new MockShape({ role: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in ariaLabel to prevent XSS", () => {
			const shape = new MockShape({ ariaLabel: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should escape special characters in ariaLabelledby to prevent XSS", () => {
			const shape = new MockShape({ ariaLabelledby: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should include all ARIA attributes together", () => {
			const shape = new MockShape({
				role: "img",
				ariaLabel: "Description",
				ariaLabelledby: "title-id",
			});
			const output = shape.toString();

			expect(output).toContain('role="img"');
			expect(output).toContain('aria-label="Description"');
			expect(output).toContain('aria-labelledby="title-id"');
		});

		it("should include title as a child element when specified", () => {
			const shape = new MockShape({ title: "Tooltip text" });
			const output = shape.toString();

			expect(output).toContain("<title>Tooltip text</title>");
			expect(output).not.toContain('title="');
		});

		it("should not include title element when not specified", () => {
			const shape = new MockShape();
			const output = shape.toString();

			expect(output).not.toContain("<title>");
		});

		it("should not include title element when whitespace-only", () => {
			const shape = new MockShape({ title: "   " });
			const output = shape.toString();

			expect(output).not.toContain("<title>");
		});

		it("should escape special characters in title child element to prevent XSS", () => {
			const shape = new MockShape({ title: '<script>alert(1)</script>' });
			const output = shape.toString();

			expect(output).not.toContain("<script>");
			expect(output).toContain("&lt;script&gt;");
		});

		it("should render title as the first child element, before animations", () => {
			const shape = new MockShape({ title: "My shape" });
			shape.animate({ attributeName: "opacity", from: "0", to: "1", dur: "1s" });
			const output = shape.toString();

			const titlePos = output.indexOf("<title>");
			const animatePos = output.indexOf("<animate");
			expect(titlePos).toBeGreaterThan(-1);
			expect(animatePos).toBeGreaterThan(-1);
			expect(titlePos).toBeLessThan(animatePos);
		});
	});

	describe("Animation methods", () => {
		it("should add animation to shape", () => {
			const shape = new MockShape();
			shape.animate({ attributeName: "test", from: "0", to: "100", dur: "1s" });
			const output = shape.toString();

			expect(output).toContain("<animate");
			expect(output).toContain('attributeName="test"');
			expect(output).toContain('from="0"');
			expect(output).toContain('to="100"');
			expect(output).toContain('dur="1s"');
			expect(output).toContain("</mock>");
		});

		it("should return this for method chaining on animate", () => {
			const shape = new MockShape();
			const result = shape.animate({ attributeName: "test", dur: "1s" });

			expect(result).toBe(shape);
		});

		it("should support multiple animations via chaining", () => {
			const shape = new MockShape();
			shape
				.animate({ attributeName: "test1", from: "0", to: "50", dur: "1s" })
				.animate({ attributeName: "test2", from: "0", to: "100", dur: "2s" });
			const output = shape.toString();

			expect(output).toContain('attributeName="test1"');
			expect(output).toContain('attributeName="test2"');
		});

		it("should clear all animations", () => {
			const shape = new MockShape();
			shape.animate({ attributeName: "test", from: "0", to: "100", dur: "1s" });

			const withAnimations = shape.toString();
			expect(withAnimations).toContain("<animate");

			shape.clearAnimations();
			const withoutAnimations = shape.toString();
			expect(withoutAnimations).not.toContain("<animate");
			expect(withoutAnimations).toBe('<mock test="default"/>');
		});

		it("should return this for method chaining on clearAnimations", () => {
			const shape = new MockShape();
			const result = shape.clearAnimations();

			expect(result).toBe(shape);
		});

		it("should allow adding animations after clearing", () => {
			const shape = new MockShape();
			shape.animate({ attributeName: "test", from: "0", to: "50", dur: "1s" });
			shape.clearAnimations();
			shape.animate({ attributeName: "test", from: "0", to: "100", dur: "2s" });

			const output = shape.toString();
			expect(output).toContain("<animate");
			expect(output).toContain('to="100"');
			expect(output).not.toContain('to="50"');
		});

		it("should work when clearing animations on a shape with no animations", () => {
			const shape = new MockShape();
			shape.clearAnimations();

			const output = shape.toString();
			expect(output).toBe('<mock test="default"/>');
		});
	});

	describe("renderElement method", () => {
		it("should generate self-closing tag when no animations", () => {
			const shape = new MockShape({ testAttr: "value" });
			const output = shape.toString();

			expect(output).toBe('<mock test="value"/>');
		});

		it("should generate open/close tags when animations are present", () => {
			const shape = new MockShape({ testAttr: "value" });
			shape.animate({ attributeName: "test", dur: "1s" });
			const output = shape.toString();

			expect(output).toMatch(/^<mock test="value"[^>]*>/);
			expect(output).toContain("<animate");
			expect(output).toContain("</mock>");
		});

		it("should combine geometric and presentation attributes", () => {
			const shape = new MockShape({
				testAttr: "geo",
				fill: "red",
				stroke: "blue",
			});
			const output = shape.toString();

			expect(output).toBe('<mock test="geo" fill="red" stroke="blue"/>');
		});

		it("should render presentation attributes in correct order", () => {
			const shape = new MockShape({
				testAttr: "test",
				id: "my-id",
				className: "my-class",
				fill: "red",
				stroke: "blue",
				strokeWidth: 2,
				strokeLinecap: "round",
				strokeLinejoin: "miter",
				opacity: 0.5,
				transform: "rotate(45)",
			});
			const output = shape.toString();

			// All attributes should be present
			expect(output).toContain('test="test"');
			expect(output).toContain('id="my-id"');
			expect(output).toContain('class="my-class"');
			expect(output).toContain('fill="red"');
			expect(output).toContain('stroke="blue"');
			expect(output).toContain('stroke-width="2"');
			expect(output).toContain('stroke-linecap="round"');
			expect(output).toContain('stroke-linejoin="miter"');
			expect(output).toContain('opacity="0.5"');
			expect(output).toContain('transform="rotate(45)"');
		});

		it("should handle zero values for numeric attributes", () => {
			const shape = new MockShape({ strokeWidth: 0, opacity: 0 });
			const output = shape.toString();

			expect(output).toContain('stroke-width="0"');
			expect(output).toContain('opacity="0"');
		});

		it("should not include undefined attributes", () => {
			const shape = new MockShape();
			const output = shape.toString();

			expect(output).not.toContain("fill=");
			expect(output).not.toContain("stroke=");
			expect(output).not.toContain("opacity=");
		});
	});

	describe("Integration with animations", () => {
		it("should preserve presentation attributes when animations are added", () => {
			const shape = new MockShape({
				fill: "red",
				stroke: "blue",
				opacity: 0.8,
			});
			shape.animate({ attributeName: "test", dur: "1s" });
			const output = shape.toString();

			expect(output).toContain('fill="red"');
			expect(output).toContain('stroke="blue"');
			expect(output).toContain('opacity="0.8"');
			expect(output).toContain("<animate");
		});

		it("should support animateTransform with type attribute", () => {
			const shape = new MockShape();
			shape.animate({ type: "rotate", from: "0", to: "360", dur: "2s" });
			const output = shape.toString();

			expect(output).toContain("<animateTransform");
			expect(output).toContain('type="rotate"');
		});
	});
});
