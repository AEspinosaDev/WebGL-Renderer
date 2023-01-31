import { Model } from "./Model.js";
import { Texture } from "./Model.js";
import { Shader } from "./Shader.js";
import { glMatrix, mat4 } from "./Utils/gl-matrix/index.js";

var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);
var angle = 0;
var yRotationMatrix = new Float32Array(16);

var vertexShaderText =
    [
        'precision mediump float;',
        '',
        'attribute vec3 vertPosition;',
        'attribute vec2 vertTexCoord;',
        'varying vec2 fragTexCoord;',
        'uniform mat4 mModel;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        '',
        'void main()',
        '{',
        '  fragTexCoord = vertTexCoord;',
        '  gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);',
        '}'
    ].join('\n');

var fragmentShaderText =
    [
        'precision mediump float;',
        '',
        'varying vec2 fragTexCoord;',
        'uniform sampler2D sampler;',
        '',
        'void main()',
        '{',
        '  gl_FragColor = texture2D(sampler, fragTexCoord);',
        '}'
    ].join('\n');


export class Renderer {
    constructor() {
        this.gl; //WebGl context
        this.canvas;

        this.shaders = new Array();
        this.models = new Array();

        //Camera
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);

        //Update
        this.boundTick = this.Tick.bind(this);

        //Customize
        this.backgroundColor = [156/255,189/255,1.0,1.0];

    }
    InitContext() {
        // Init WebGL context
        console.log('Starting renderer...');

        this.canvas = document.getElementById('glcanvas');
        this.gl = this.canvas.getContext('webgl');

        if (!this.gl) {
            console.log('WebGL not supported, falling back on experimental-webgl');
            this.gl = this.canvas.getContext('experimental-webgl');
        }

        if (!this.gl) {
            alert('Your browser does not support WebGL');
        }

        console.log('Graphics initiated successfully');

        this.gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);
        // this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
    }
    SetupScene() {
        //Implement here scene loadout...

        var diffuseShader = new Shader(this.gl, vertexShaderText, fragmentShaderText);
        this.shaders.push(diffuseShader);
        //var diffuseShader = new Shader(gl,"../Resources/Shaders/DiffuseShader.vs.glsl","../Resources/Shaders/DiffuseShader.fs.glsl");
        //var box = new Model(this.gl, "../Resources/Models/test-box.json", diffuseShader);
        var box = new Model(this.gl,"../Resources/Models/warrior-test.json", diffuseShader);
        //box.LoadTexture('crate-image', Texture.Albedo);
        box.LoadTexture('armor', Texture.Albedo);
        box.Scale([0.02,0.02,0.02]);
        this.models.push(box);

    }

    InitCam() {
        mat4.lookAt(this.viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);

        mat4.perspective(this.projMatrix, glMatrix.toRadian(45), this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000.0);

        // for all shaders in scene
        this.shaders.forEach(s => {
            s.Use();
            s.SetMat4('mView', this.viewMatrix);
            s.SetMat4('mProj', this.projMatrix);
        });



    }


    Update() {
        this.models.forEach(m => {
            m.Update();
        });
    }
    Render() {
        this.gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);

        this.models.forEach(m => {
            m.Render();
        });
    }
    ResizeCanvas() {
        var cssToRealPixels = window.devicePixelRatio || 1,
            displayWidth = Math.floor(this.canvas.clientWidth * cssToRealPixels),
            displayHeight = Math.floor(this.canvas.clientHeight * cssToRealPixels);
        if (this.canvas.width != displayWidth || this.canvas.height != displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
        }
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        mat4.perspective(this.projMatrix, glMatrix.toRadian(45), this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000.0);
        
        this.shaders.forEach(s => {
            s.Use();
            s.SetMat4('mView', this.viewMatrix);
            s.SetMat4('mProj', this.projMatrix);
        });
    }
    Tick() {
        this.ResizeCanvas();
        //resizeCanvas();
       
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(this.models[0].model, this.models[0].model, 0.015, [0, 1, 0]);
        //mat4.mul(this.models[0].model,identityMatrix, yRotationMatrix);
        
        // box.Scale([0.02,0.02,0.02]);
        // mat4.scale(this.models[0].model,identityMatrix,[0.02,0.02,0.02]);
        // diffuseShader.SetMat4('mModel', box.model);
        this.Update();
        this.Render();

        requestAnimationFrame(this.boundTick);

    }

    Run() {

        this.InitContext();

        this.SetupScene();

        this.InitCam();

        this.Tick();
    }
}





