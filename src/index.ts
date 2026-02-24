export type {
	AnimateOptions,
	AnimateTransformOptions,
	BaseAnimationOptions,
	SmilAnimationOptions,
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
export type { PathOptions } from "./shapes/path.js";
export { Path } from "./shapes/path.js";
export type { PolygonOptions } from "./shapes/polygon.js";
export { Polygon } from "./shapes/polygon.js";
export type { RectOptions } from "./shapes/rect.js";
export { Rect } from "./shapes/rect.js";

export { escapeXml } from "./utils/escape.js";
