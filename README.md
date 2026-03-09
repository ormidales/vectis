## Concept
L'objectif est de créer et de manipuler des fichiers SVG dynamiquement via une interface programmatique orientée objet. La solution consiste en une bibliothèque typée permettant de générer, composer et exporter des formes, des chemins et des animations pour les environnements web et serveurs.

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

Use `animateTransform` for transform animations:

```ts
circle.animate({
  type: "rotate",
  from: "0 100 100",
  to: "360 100 100",
  dur: "2s",
  repeatCount: "indefinite",
});
```

## Stack Technique
- Langage : TypeScript (Typage statique strict, autocomplétion pour la construction d'arbres de nœuds).
- Tests : Vitest (Exécution rapide, support natif ESM).
- Build : tsup (Bundling rapide basé sur esbuild, génération automatique des définitions de types).
- Linting : Biome (Performances de formatage et d'analyse statique).

## Idées de logos
- Minimalist geometric logo combining a stylized code bracket and a pen tool, clean vector art style, dark mode palette with neon blue and purple accents.
- Abstract node network forming a scalable vector graphic icon, wireframe style, tech-oriented, flat colors on a pure white background.
- Flat design logo featuring overlapping SVG primitives like a circle, square, and triangle forming a cohesive dynamic shape, vibrant colors, sharp edges.
