import { Model } from "./Model.js"

export class CSGModeller {

    constructor(THREE) {
        this._THREE = THREE;
    }

    model(mesh) {
        return Model._fromMesh(this._THREE, mesh);
    }

}