import { Mesh } from "./Mesh.js";
import { BasicMaterial} from "./BasicMaterial.js";
import { Shader } from "./Shader.js";
import { Camera } from "./Camera.js";
import { mat4 } from "./Utils/gl-matrix/index.js";
import { Model } from "./Model.js";

var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);


var vertexShaderText =
    [
        '#version 300 es',
        'in vec3 vertPosition;',
        'in vec2 vertTexCoord;',
        'in vec2 vertNormal;',
        'in vec2 vertTangent;',
        'uniform mat4 mModel;',
        'uniform mat4 mView;',
        'uniform mat4 mProj;',
        'out vec2 fragTexCoord;',
        '',
        'void main()',
        '{',
        '  fragTexCoord = vertTexCoord;',
        '  gl_Position = mProj * mView * mModel * vec4(vertPosition, 1.0);',
        '}'
    ].join('\n');

var fragmentShaderText =
    [
        '#version 300 es',
        'precision mediump float;',
        'in vec2 fragTexCoord;',
        'uniform sampler2D sampler;',
        'out vec4 color;',
        '',
        'void main()',
        '{',
        '  color = texture(sampler, fragTexCoord);',
        '}'
    ].join('\n');


export class Renderer {
    constructor() {
        this.gl; //WebGl context
        this.canvas;

        this.shaders = new Array();
        this.models = new Array();

        //Camera
        this.camera = new Camera([2, 2, -8], [0, 0, 0], [0, 1, 0], false, 45, 0.1, 1000.0);
        //Update
        this.boundTick = this.Tick.bind(this);

        //Customize
        this.backgroundColor = [156 / 255, 189 / 255, 1.0, 1.0];

    }
    InitContext() {
        // Init WebGL context
        console.log('Starting renderer...');

        this.canvas = document.getElementById('glcanvas');
        this.gl = this.canvas.getContext('webgl2');

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
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);
    }
    SetupScene() {
        //Implement here scene loadout...

        var diffuseShader = new Shader(this.gl, vertexShaderText, fragmentShaderText);
        this.shaders.push(diffuseShader);
        var diffuseMat = new BasicMaterial(0,diffuseShader, 'crate', null, null);
        //var diffuseShader = new Shader(gl,"../Resources/Shaders/DiffuseShader.vs.glsl","../Resources/Shaders/DiffuseShader.fs.glsl");
        
        var box = new Model(this.gl, "../Resources/Models/test-box.json", [diffuseMat]);
        var box2 = new Model(this.gl, "../Resources/Models/test-box.json", [diffuseMat]);
        var warrior = new Model(this.gl, "../Resources/Models/sphere.json", [diffuseMat]);
        
        warrior.Scale([0.02, 0.02, 0.02]);
        box.Translate([2,0,0]);
        warrior.Translate([2,2,0]);
        this.models.push(box);
        this.models.push(box2);
        this.models.push(warrior);

        
    }

    InitCam() {
        this.camera.Refresh(this.canvas);
        // for all shaders in scene
        this.shaders.forEach(s => {
            s.Use();
            s.SetMat4('mView', this.camera.viewMatrix);
            s.SetMat4('mProj', this.camera.projMatrix);
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
        this.camera.Refresh(this.canvas);

        this.shaders.forEach(s => {
            s.Use();
            s.SetMat4('mView', this.camera.viewMatrix);
            s.SetMat4('mProj', this.camera.projMatrix);
        });
    }
    Tick() {
        this.ResizeCanvas();

        // mat4.rotate(this.models[0].model, this.models[0].model, 0.015, [0, 1, 0]);


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





