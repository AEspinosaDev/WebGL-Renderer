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

        this.turnSpeed = 90;
        this.speed = 1;
        this.ang = 0;
        this.roll = 0;
        this.elev = 0;

        mat4.lookAt(this.viewMatrix, this.position, this.forward, this.up);

    }
    Refresh(canvas) {
        if (!this.isOrtho) {
            mat4.perspective(this.projMatrix, glMatrix.toRadian(this.fov), canvas.clientWidth / canvas.clientHeight, this.near, this.far);
        } else {
            mat4.ortho(this.projMatrix, 0, canvas.clientWidth, 0, canvas.clientHeight, this.near, this.far);
        }
    }


    Update(keys, deltaTime) {
        
        
        // mat4.invert(this.viewMatrix,  camera);
        var modView = new Float32Array(16);
        mat4.identity(modView);
        mat4.translate(modView, modView,[ this.position[0],  this.position[1],  this.position[2]]);
        mat4.rotateX(modView, modView, this.#DegToRad(this.elev));
        mat4.rotateY(modView, modView, this.#DegToRad(-this.ang));
        mat4.rotateZ(modView, modView, this.#DegToRad(this.roll));
        this.viewMatrix = modView;


        if (keys['87'] || keys['83']) {
            const direction = keys['87'] ? -1 : 1;
            this.position[0] -= modView[8] * deltaTime * this.speed * direction;
            this.position[1] -= modView[9] * deltaTime * this.speed * direction;
            this.position[2] -= modView[10] * deltaTime * this.speed * direction;
        }

        if (keys['65'] || keys['68']) {
            const direction = keys['65'] ? 1 : -1;
            this.ang += deltaTime * this.turnSpeed * direction;
        }

        if (keys['81'] || keys['69']) {
            const direction = keys['81'] ? 1 : -1;
            this.roll += deltaTime * this.turnSpeed * direction;
        }

        if (keys['38'] || keys['40']) {
            const direction = keys['38'] ? 1 : -1;
            this.elev += deltaTime * this.turnSpeed * direction;
        }



    }
    #DegToRad(d) {
        return d * Math.PI / 180;
      }
}