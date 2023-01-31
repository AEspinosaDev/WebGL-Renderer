import { Renderer } from "./Renderer.js";
import { mat4 } from "./Utils/gl-matrix/index.js";

export const Texture = {
    Albedo: 0,
    Normal: 1,
    Specular: 2,
}

//For now we forget about material class but should be added

export class Model {
    constructor(gl, route, shader) {

        this.gl = gl;
        this.model = new Float32Array(16);
        mat4.identity(this.model);

        this.shaders = new Array();
        this.shaders.push(shader);

        this.buffers = new Array();
        this.indexBuffer = null;

        //Textures
        this.albedoTexture = null;
        this.normalTexture = null;
        this.specularTexture = null;

        this.indexList = null;

        this.loaded = false;


        this.LoadModelData(route, shader);

    }

    async LoadModelData(route, shader) {

        const promiseOfData = await fetch(route)
            .then((response) => response.json());

        this.InitBuffers(promiseOfData, shader)

    }


    InitBuffers(modelData, currentShader) {

        this.indexList = [].concat.apply([], modelData.meshes[0].faces);
        var vertexPosList = modelData.meshes[0].vertices;
        var texCoordList = modelData.meshes[0].texturecoords[0];
        var normalsList = modelData.meshes[0].normals;
        var tangentsList = modelData.meshes[0].tangents;

        //Vertex data
        var posBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPosList), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            0, // Attribute location
            3, // Number of elements per attribute
            this.gl.FLOAT,
            this.gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT, //vertex size
            0 //offset
        );
        this.gl.enableVertexAttribArray(0);

        var coordBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, coordBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoordList), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            1,
            2,
            this.gl.FLOAT,
            this.gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(1);

        var normalBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalsList), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            2,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(2);

        var tangentBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tangentsList), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(
            3,
            3,
            this.gl.FLOAT,
            this.gl.FALSE,
            3 * Float32Array.BYTES_PER_ELEMENT,
            0
        );
        this.gl.enableVertexAttribArray(3);

        //Index
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexList), this.gl.STATIC_DRAW);

        this.buffers.push(posBufferObject);
        this.buffers.push(coordBufferObject);
        this.buffers.push(normalBufferObject);
        this.buffers.push(tangentBufferObject);


        currentShader.SetAttrib('vertPosition');
        currentShader.SetAttrib('vertTexCoord');
        currentShader.SetAttrib('vertNormal');
        currentShader.SetAttrib('vertTangent');

        this.loaded = true;

    }
    LoadTexture(imageRoute, type) {

        switch (type) {
            case Texture.Albedo:
                console.log("va");
                break;

            default:
                break;
        }
        // (type = Text.Albedo)
        this.albedoTexture = this.gl.createTexture();

        this.gl.bindTexture(this.gl.TEXTURE_2D, this.albedoTexture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            document.getElementById(imageRoute)
        );
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);


    }
    Update() {
        this.shaders.forEach(s => {
            s.Use();
            s.SetMat4('mModel', this.model);
        });
    }
    Render() {

        this.shaders.forEach(s => {

            s.Use();

            //Textures
            if (this.loaded) {
                if (this.albedoTexture != null) {
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.albedoTexture);
                    this.gl.activeTexture(this.gl.TEXTURE0);
                }

                if (this.normalTexture != null) {
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.normalTexture);
                    this.gl.activeTexture(this.gl.TEXTURE1);
                }

                if (this.specularTexture != null) {
                    this.gl.bindTexture(this.gl.TEXTURE_2D, this.specularTexture);
                    this.gl.activeTexture(this.gl.TEXTURE2);
                }

                //Binding buffers
                this.buffers.forEach(vbo => {
                    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
                });
                this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

                this.gl.drawElements(this.gl.TRIANGLES, this.indexList.length, this.gl.UNSIGNED_SHORT, 0);
            }
        });

    }
    AddShader(shader) {
        if (!this.shaders.find(shader)) {

            shader.SetAttrib('vertPosition');
            shader.SetAttrib('vertTexCoord');
            shader.SetAttrib('vertNormal');
            shader.SetAttrib('vertTangent');

            this.shaders.push(shader)
        }
    }

    /**
     * Translates the model to the desire location. {Global}
     * @param {vec3} pos Translating vector
     */
    Translate(pos) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.translate(this.model,identityMatrix, pos)
    }

    Scale(factor) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.scale(this.model, identityMatrix, factor)

    }

}