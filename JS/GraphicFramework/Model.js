import { Mesh } from "./Mesh.js";
import { Utils } from "./Utils/Utils.js";

export class Model {
    constructor(renderer,route, materialID) {

        this.meshes = new Map();
        this.numOfMeshes = 0;
        //this.LoadModelData(gl, route, matsList)
        
        this.loaded = false;


        this.position = [0, 0, 0];
        this.scaleFactor = [1, 1, 1];

        renderer.models.push(this);

        this.Load(renderer.gl,route,renderer.materials.get(materialID),renderer.loadedCallback)

    }
   
    //Async
    Load(gl, route, mat, callback){
        var root = this;

        Utils.loadJson(route, function(data){
            root.numOfMeshes = data.meshes.length;

            var mesh;
    
            for (let i = 0; i < root.numOfMeshes; i++) {
                mesh = new Mesh(gl, i, data.meshes[i], mat);
                mesh.Transform(root.position, root.scaleFactor);
                root.meshes.set(mesh.id, mesh);
            }
            root.loaded = true;
            root.loaded && callback();
        });

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
                value.Transform(this.position, this.scaleFactor);
            }

        }
    }

    Scale(factor) {
        this.scaleFactor = factor;
        if (this.loaded) {
            for (let value of this.meshes.values()) {
                value.Transform(this.position, this.scaleFactor);
            }
        }
    }



}