import * as THREE from "three"
import { CSG } from "../lib/csg"

declare export class Model {

    /**
     * Construct a Model. 
     * Consumers should use `Modeller.model` instead.
     * @param THREE - Inject the three.js lib
     * @internal
     */
    constructor(THREE: THREE);

    /**
     * The three.js lib injected from constructor.
     * @internal
     */
    _THREE: THREE;

    /**
     * The CSG instance.
     * @internal
     */
    _csg: CSG;

    /**
     * Construct a new model holding the union of `this` model and input model.
     * @param model - The input model.
     */
    union(model: Model): Model;

    /**
     * Construct a new model holding the difference of `this` model and input model.
     * @param model - The input model.
     */
    subtract(model: Model): Model;

    /**
     * Construct a new model holding the intersection of `this` model and input model.
     * @param model - The input model.
     */
    intersect(model: Model): Model;

    /**
     * Construct a new model holding the result of transformed model.
     * @param matrix - The transformation matrix.
     */
    applyMatrix4(matrix: THREE.Matrix4): Model;

    /**
     * Build a mesh using `BufferGeometry`. 
     */
    build(): THREE.Mesh;

    /**
     * Construct a `Model` from a three.js `Mesh`.
     * @param THREE - The three.js lib.
     * @param mesh - The input mesh.
     * @internal
     */
    static _fromMesh(THREE: THREE, mesh: THREE.Mesh): Model;
}