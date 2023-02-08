
import { mat4 } from "./Utils/gl-matrix/index.js";




export class Mesh {
    constructor(gl, id, modelData, mat) {

        this.id = id;
        // this.materia

        this.gl = gl;
        this.model = new Float32Array(16);
        mat4.identity(this.model);
        // var identityMatrix = new Float32Array(16);
        // mat4.identity(identityMatrix);
        // mat4.translate(this.model, identityMatrix, [2,0,0])
        // //mat4.scale(this.model, identityMatrix, [2,2,2])

        this.material = mat

        this.buffersCache = new Array();
        this.indexBuffer = null;

        this.indexList = null;


        this.InitBuffers(modelData, mat.shader);

    }


    InitBuffers(modelData, shader) {
        console.log(modelData);
        this.indexList = [].concat.apply([], modelData.faces);
        var vertexPosList = modelData.vertices;
        var texCoordList = modelData.texturecoords[0];
        var normalsList = modelData.normals;
        var tangentsList = modelData.tangents;

        //Vertex data
        var posBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexPosList), this.gl.STATIC_DRAW);
        shader.GetAttrib('vertPosition'); // Attribute location

        var coordBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, coordBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoordList), this.gl.STATIC_DRAW);
        shader.GetAttrib('vertTexCoord');

       

        var normalBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, normalBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(normalsList), this.gl.STATIC_DRAW);
        shader.GetAttrib('vertNormal');
       

        var tangentBufferObject = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, tangentBufferObject);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(tangentsList), this.gl.STATIC_DRAW);
        shader.GetAttrib('vertTangent');
        

        //Index
        this.indexBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexList), this.gl.STATIC_DRAW);

        this.buffersCache.push([posBufferObject, shader.GetAttrib('vertPosition'),3]);
        this.buffersCache.push([coordBufferObject, shader.GetAttrib('vertTexCoord'),2]);
        this.buffersCache.push([normalBufferObject, shader.GetAttrib('vertNormal'),3]);
        this.buffersCache.push([tangentBufferObject, shader.GetAttrib('vertTangent'),3]);


        shader.SetMat4('mModel', this.model);


    }

    Update() {
        this.material.shader.Use();
    }
    Render() {

        //Binding material
        this.material.BindTextures();

        this.material.shader.SetMat4('mModel', this.model);

        //Binding buffers
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.buffersCache.forEach(vaoData => {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vaoData[0]);
            this.gl.enableVertexAttribArray(vaoData[1]);
            this.gl.vertexAttribPointer(
                vaoData[1], // Attribute location
                vaoData[2], // Number of elements per attribute
                this.gl.FLOAT,
                this.gl.FALSE,
                vaoData[2] * Float32Array.BYTES_PER_ELEMENT, //vertex size
                0 //offset
            );
        });

        this.gl.drawElements(this.gl.TRIANGLES, this.indexList.length, this.gl.UNSIGNED_SHORT, 0);


    }

    Transform(pos, scale) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.translate(this.model, identityMatrix, pos);
        mat4.scale(this.model, this.model, scale);

    }

}