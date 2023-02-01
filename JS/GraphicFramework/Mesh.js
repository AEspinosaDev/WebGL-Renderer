
import { mat4 } from "./Utils/gl-matrix/index.js";




export class Mesh {
    constructor(gl,id,modelData, mat) {

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

        this.buffers = new Array();
        this.indexBuffer = null;

        this.indexList = null;


       this.InitBuffers(modelData,mat.shader);

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


        shader.SetAttrib('vertPosition');
        shader.SetAttrib('vertTexCoord');
        shader.SetAttrib('vertNormal');
        shader.SetAttrib('vertTangent');
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
        this.buffers.forEach(vbo => {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        });
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        
        this.gl.drawElements(this.gl.TRIANGLES, this.indexList.length, this.gl.UNSIGNED_SHORT, 0);
        
        
    }
    
    
    /**
     * Translates the model to the desire location. {Global}
     * @param {vec3} pos Translating vector
    */
   Translate(pos) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.translate(this.model, identityMatrix, pos)
    }

    Scale(factor) {
        var identityMatrix = new Float32Array(16);
        mat4.identity(identityMatrix);
        mat4.scale(this.model, identityMatrix, factor)

    }

}