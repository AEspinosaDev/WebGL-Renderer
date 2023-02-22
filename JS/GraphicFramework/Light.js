import { Model } from "./Model.js";


export class Light {
    
    constructor(renderer,pos, color, intensity) {
        renderer.lights.push(this);
        this.pos = pos;
        this.color = color;
        this.intensity = intensity;
    }


}