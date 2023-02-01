import { Mesh } from "./Mesh.js";

export class Model {
    constructor(gl, route, matsList) {

        this.meshes = new Map();
        this.numOfMeshes = 0;
        this.LoadModelData(gl, route, matsList)
        this.loaded = false;


        this.position = [0, 0, 0];
        this.scaleFactor = [1, 1, 1];

    }
    async LoadModelData(gl, route, matsList) {

        const promiseOfData = await fetch(route)
            .then((response) => response.json());

        this.numOfMeshes = promiseOfData.meshes.length;

        var mesh;

        for (let i = 0; i < this.numOfMeshes; i++) {
            mesh = new Mesh(gl, i, promiseOfData.meshes[i], matsList[0]);
            this.meshes.set(mesh.id, mesh);
        }
        for (let value of this.meshes.values()) {
            value.Scale(this.scaleFactor)
            //value.Translate(this.position);
        }
        this.loaded = true;
        


    }
    Update() {
        if (this.loaded) {
            for (let value of this.meshes.values()) {
                value.Update();
            }
        }
     }

    Render() {
        if (this.loaded) {
            for (let value of this.meshes.values()) {
                value.Render();
            }
        }
    }
    /**
         * Translates the model to the desire location. {Global}
         * @param {vec3} pos Translating vector
         */
    Translate(pos) {
        this.position = pos;
        if (this.loaded) {
            for (let value of this.meshes.values()) {
                value.Translate(pos);
            }

        }
    }

    Scale(factor) {
        this.scaleFactor = factor;
        if (this.loaded) {
            for (let value of this.meshes.values()) {
                value.Scale(factor);
            }
        }
    }


}