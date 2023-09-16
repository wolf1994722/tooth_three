# About

Solid mesh modeling for three.js.

## Featrues

- Manipulate `BufferGeometry` directly.
- Support vertex color and mutli-material.
- Dump mesh with indexed `BufferGeometry`.

## Examples

- [Gradient Crown](https://ycw.github.io/three-csg-modeller/examples/gradient-crown/) (vertex color)
- [Gallery Frame](https://ycw.github.io/three-csg-modeller/examples/gallery-frame/) (mutli-material)
- [Extrude Inwards](https://ycw.github.io/three-csg-modeller/examples/extrude-inwards/) (set operations)

## Installation

Via npm ( `npm i ycw/three-csg-modeller#v0.1.10` )

```js
import { CSGModeller } from "three-csg-modeller"
```

Via cdn

```js
import { CSGModeller } from "https://cdn.jsdelivr.net/gh/ycw/three-csg-modeller@0.1.10/dist/lib.esm.js"
```

## Usage

```js
// Ex. Subtract a box from a sphere.
const modeller = new CSGModeller(THREE);
const sphereModel = modeller.model(new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5),
  new THREE.MeshLambertMaterial({ color: "black" })
));
const boxModel = modeller.model(new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.5, 0.5, 1),
  new THREE.MeshLambertMaterial({ color: "white" })
));
const model = sphereModel.subtract(boxModel);
const mesh = model.build();
```

Live result: [Basic Subtract](https://ycw.github.io/three-csg-modeller/examples/basic-subtract/). See also: [Basic Multi-Material](https://ycw.github.io/three-csg-modeller/examples/basic-multi-material/).

## API

### `CSGModeller`

`new CSGModeller(THREE)`
- Construct a modeller. `THREE` is the three.js lib.

`.model(mesh)`
- Create a `Model` instance from a mesh whose `.geometry` must be a `BufferGeometry`.

### `Model`

`.union(model)`
- Return a new model holding result of `this` &cup; `model`.

`.subtract(model)`
- Return a new model holding result of `this` &minus; `model`.

`.intersect(model)`
- Return a new model holding result of `this` &cap; `model`.

`.applyMatrix4(matrix)` 
- Return a new transformed model. Param `matrix` is a `THREE.Matrix4`.

`.build()`
- Build and return a mesh holding an indexed `BufferGeometry`.

## Credits

- [evanw/csg.js](https://evanw.github.io/csg.js/)
- [mrdoob/three.js](https://github.com/mrdoob/three.js)

## License

[MIT](LICENSE)