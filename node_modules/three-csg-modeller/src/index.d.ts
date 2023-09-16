import * as THREE from "three"
import { Model } from "./Model"

declare export class CSGModeller {

    /**
     * Construct a `Modeller`. Please inject the three.js library like the following:
     * 
     * ```js
     * import * as THREE from "three"
     * const modeller = new Modeller(THREE);
     * ``` 
     * 
     * @param THREE - The three.js lib.
     */
    constructor(THREE: THREE);

    /**
     * The three.js lib injected from constructor. 
     * @internal
     */
    _THREE: THREE;

    /**
     * Construct a model from input mesh. The mesh must hold a `BufferGeometry` which
     * must contain `attributes.position` and optionally include attributes `normal`, 
     * `uv` and `color`.
     * @param mesh - The mesh to model.
     */
    model(mesh: THREE.Mesh): Model;

}