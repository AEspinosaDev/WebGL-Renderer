import { glMatrix, mat4 } from "./Utils/gl-matrix/index.js";

export class Camera {
    constructor(pos, fwd, up, isOrtho, fov, far, near) {

        this.position = pos;
        this.forward = fwd;
        this.up = up;

        this.isOrtho = isOrtho;

        this.fov = fov;
        this.far = far;
        this.near = near;

        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);
        
        mat4.lookAt(this.viewMatrix, this.position, this.forward, this.up);

    }
    Refresh(canvas) {
        if (!this.isOrtho) {
            mat4.perspective(this.projMatrix, glMatrix.toRadian(this.fov), canvas.clientWidth / canvas.clientHeight, this.near, this.far);
        } else {
            mat4.ortho(this.projMatrix, 0, canvas.clientWidth, 0, canvas.clientHeight, this.near, this.far);
        }
    }

    Move() {
        //..
    }
}