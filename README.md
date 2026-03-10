## Concept
The goal is to create and manipulate SVG files dynamically through an object-oriented programmatic interface. The solution is a typed library for generating, composing and exporting shapes, paths and animations for web and server environments.

## Installation

```bash
npm install vectis
```

## Quick start

```ts
import { SvgCanvas, Circle, Rect } from "vectis";

const canvas = new SvgCanvas({ width: 200, height: 200 });
canvas.add(new Circle({ cx: 100, cy: 100, r: 50, fill: "steelblue" }));
canvas.add(new Rect({ x: 10, y: 10, width: 80, height: 60, fill: "orange" }));
console.log(canvas.toString());
// '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><circle cx="100" cy="100" r="50" fill="steelblue"/><rect x="10" y="10" width="80" height="60" fill="orange"/></svg>'
```

## Shapes

| Class     | SVG element   | Key options                                      |
|-----------|---------------|--------------------------------------------------|
| `Circle`  | `<circle>`    | `cx`, `cy`, `r`                                  |
| `Ellipse` | `<ellipse>`   | `cx`, `cy`, `rx`, `ry`                           |
| `Rect`    | `<rect>`      | `x`, `y`, `width`, `height`                      |
| `Line`    | `<line>`      | `x1`, `y1`, `x2`, `y2`                           |
| `Path`    | `<path>`      | `d` (SVG path data string)                       |
| `Polygon` | `<polygon>`   | `points` (space- or comma-separated coordinates) |
| `Group`   | `<g>`         | use `.add(shape)` for nested shapes              |

All shapes accept common [presentation attributes](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/Presentation) such as `fill`, `stroke`, `strokeWidth`, `opacity`, `transform`, `id`, `className`, and `style`.

## Animations (SMIL)

Attach one or more SMIL animations to any shape with the `.animate()` method:

```ts
import { SvgCanvas, Circle } from "vectis";

const canvas = new SvgCanvas({ width: 200, height: 200 });
const circle = new Circle({ cx: 100, cy: 100, r: 50, fill: "steelblue" });

circle.animate({
  attributeName: "r",
  from: "50",
  to: "80",
  dur: "1s",
  repeatCount: "indefinite",
});

canvas.add(circle);
console.log(canvas.toString());
```

Use `.animate()` with a `type` option to produce an `<animateTransform>` element:

```ts
circle.animate({
  type: "rotate",
  from: "0 100 100",
  to: "360 100 100",
  dur: "2s",
  repeatCount: "indefinite",
});
```

## Technical Stack
- Language: TypeScript (strict static typing, autocompletion for building node trees).
- Tests: Vitest (fast execution, native ESM support).
- Build: tsup (fast bundling based on esbuild, automatic type definition generation).
- Linting: Biome (formatting and static analysis performance).

