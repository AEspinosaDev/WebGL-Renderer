import { Utils } from "./Utils/Utils.js";

/**
 * 
 * @param {} gl WebGL context
 * @param {string} vertSourceRoute Vert file route
 * @param {string} fragSourceRoute Frag file route
 */
export class Shader {
    constructor(renderer, id, shaderSourceRoute, type) {

        this.gl = renderer.gl;
        this.id = id;
        this.type = type;

        renderer.shaders.set(id, this);
        // renderer.shaders.push(this);
        this.vertexShader = null;
        this.fragmentShader = null;

        this.attributesLocationCache = new Map();
        this.uniformLocationCache = new Map();

        this.LoadShader(shaderSourceRoute, renderer.shaderLoadedCallback);



    }

    //ASYNC
    LoadShader(shaderSourceRoute, callback) {
        var root = this;

        Utils.LoadTextResource(shaderSourceRoute, function (data) {

            var splittedShaderSource = data.split("--SPLIT--");
            var vertShaderSource = splittedShaderSource[0];
            var fragShaderSource = splittedShaderSource[1];

            root.vertexShader = root.gl.createShader(root.gl.VERTEX_SHADER);
            root.fragmentShader = root.gl.createShader(root.gl.FRAGMENT_SHADER);

            root.CompileShaders(vertShaderSource, fragShaderSource); //Shader text source

            root.program = root.InitShader();

            callback();

        });

    }
    /**
     *
     * @param {string} vertSourceRoute Vert file route
     * @param {string} fragSourceRoute Frag file route
     * @returns Program ID
    */
    InitShader() {

        var program = this.gl.createProgram();
        this.gl.attachShader(program, this.vertexShader);
        this.gl.attachShader(program, this.fragmentShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('ERROR linking program!', this.gl.getProgramInfoLog(program));
            return;
        }
        this.gl.validateProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.VALIDATE_STATUS)) {
            console.error('ERROR validating program!', this.gl.getProgramInfoLog(program));
            return;
        }

        return program;
    }

    CompileShaders(vertSourceRoute, fragSourceRoute) {

        this.gl.shaderSource(this.vertexShader, vertSourceRoute); //Parse!!
        this.gl.shaderSource(this.fragmentShader, fragSourceRoute); //Parse!!

        this.gl.compileShader(this.vertexShader);
        if (!this.gl.getShaderParameter(this.vertexShader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling vertex shader!', this.gl.getShaderInfoLog(this.vertexShader));
            return;
        }

        this.gl.compileShader(this.fragmentShader);
        if (!this.gl.getShaderParameter(this.fragmentShader, this.gl.COMPILE_STATUS)) {
            console.error('ERROR compiling fragment shader!', this.gl.getShaderInfoLog(this.fragmentShader));
            return;
        }

    }

    Use() {
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }

    /**
     * Stores a uniform representing a 4x4 matrix
     * @param {string} name Uniform name
     * @param {Float16Bytes} value Matrix vamue
     */
    SetMat4(name, value) {
        this.gl.uniformMatrix4fv(this.GetUniform(name), this.gl.FALSE, value);
    }
    SetInt(name, value) {
        this.gl.uniform1i(this.GetUniform(name), value);
    }
    SetFloat(name, value) {
        this.gl.uniform1f(this.GetUniform(name), value);
    }
    SetVec2(name, x, y) {
        this.gl.uniform2f(this.GetUniform(name), x, y);
    }
    SetVec3(name, x, y, z) {
        this.gl.uniform3f(this.GetUniform(name), x, y, z);
    }
    SetVec4(name, x, y, z, k) {
        this.gl.uniform4f(this.GetUniform(name), x, y, z, k);
    }


    /**
        * Get shader unform location if exists and if not, create it and store it
        * @param {string} name - uniform name
        * @return {number} - uniform location
        */
    GetUniform(name) {
        if (!this.uniformLocationCache.has(name)) {
            this.uniformLocationCache.set(name, this.gl.getUniformLocation(this.program, name));
        }
        return this.uniformLocationCache.get(name);
    }


    SetAttrib(name) {
        if (!this.attributesLocationCache.has(name)) {
            var attrib_id = this.gl.getAttribLocation(this.program, name);
            this.attributesLocationCache.set(name, attrib_id);
            return attrib_id;
        }
    }

    /**
     * Get shader attribute location
     * @param {string} name - uniform name
     * @return {number} - attribute location
     */
    GetAttrib(name) {
        if (!this.attributesLocationCache.has(name)) {
            this.attributesLocationCache.set(name, this.gl.getAttribLocation(this.program, name));
        }
        return this.attributesLocationCache.get(name);
    }
}




