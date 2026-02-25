export type {
	AnimateOptions,
	AnimateTransformOptions,
	AnimationValue,
	BaseAnimationOptions,
	ColorValue,
	NumericValue,
	SmilAnimationOptions,
	TransformValue,
} from "./animation/smil.js";
export { renderSmilAnimation } from "./animation/smil.js";

export { BaseShape } from "./core/base-shape.js";
export type { SvgCanvasOptions } from "./core/canvas.js";
export { SvgCanvas } from "./core/canvas.js";

export type {
	PresentationAttributes,
	Shape,
} from "./interfaces/shape.interface.js";

export type { CircleOptions } from "./shapes/circle.js";
export { Circle } from "./shapes/circle.js";
export type { EllipseOptions } from "./shapes/ellipse.js";
export { Ellipse } from "./shapes/ellipse.js";
export type { LineOptions } from "./shapes/line.js";
export { Line } from "./shapes/line.js";
export type { PathOptions } from "./shapes/path.js";
export { Path } from "./shapes/path.js";
export type { PolygonOptions } from "./shapes/polygon.js";
export { Polygon } from "./shapes/polygon.js";
export type { RectOptions } from "./shapes/rect.js";
export { Rect } from "./shapes/rect.js";

export { escapeXml } from "./utils/escape.js";
export { renderAttribute } from "./utils/render-attribute.js";
