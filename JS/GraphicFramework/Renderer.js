import { Mesh } from "./Mesh.js";
import { BasicMaterial } from "./BasicMaterial.js";
import { Shader } from "./Shader.js";
import { Camera } from "./Camera.js";
import { mat4 } from "./Utils/gl-matrix/index.js";
import { Model } from "./Model.js";
import { Texture } from "./Texture.js";

var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);


export class Renderer {
    constructor() {
        this.gl; //WebGl context
        this.canvas;

        this.loaded = false;
        this.numModelsLoaded = 0;
        this.numTexturesLoaded = 0;
        this.numShadersLoaded = 0;

        this.shaders = new Map();
        this.textures = new Map();
        this.models = new Array();


        //Camera
        this.camera = new Camera([2, 2, -8], [0, 0, 0], [0, 1, 0], false, 45, 0.1, 1000.0);

        //Callbacks
        this.boundTick = this.Tick.bind(this);
        this.shaderLoadedCallback = this.UpdateLoadedShadersCount.bind(this);
        this.loadedCallback = this.UpdateLoadedModelsCount.bind(this);
        this.textureLoadedCallback = this.UpdateLoadedTexturesCount.bind(this);

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
    LoadResources() {
        this.LoadShaders();
    }

    LoadShaders() {

        new Shader(this, "diffuseShader", "../Resources/Shaders/DiffuseShader.glsl");



    }
    LoadTextures() {
        new Texture(this,"albedoCrate", "../Resources/Textures/crate.png");

    }

    LoadModels() {
        //Implement here scene loadout...

        var diffuseMat = new BasicMaterial(this, 0, "diffuseShader", "albedoCrate", null, null);

        var box = new Model(this, "../Resources/Models/warrior-test.json", [diffuseMat]);
        var box2 = new Model(this, "../Resources/Models/test-box.json", [diffuseMat]);


        box.Scale([0.02, 0.02, 0.02]);
        box2.Translate([2, 0, 0]);



    }
    UpdateLoadedShadersCount() {
        this.numShadersLoaded++;
        if (this.numShadersLoaded == this.shaders.size) {
            this.LoadTextures();
        }
    }
    UpdateLoadedTexturesCount() {
        this.numTexturesLoaded++;
        if (this.numTexturesLoaded == this.textures.size) {
            this.LoadModels();
        }
    }

    UpdateLoadedModelsCount() {
        this.numModelsLoaded++;
        if (this.numModelsLoaded == this.models.length) {
            this.loaded = true; // allow rendering
        }
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

        if (this.loaded) {

            this.ResizeCanvas();
            // mat4.rotate(this.models[0].model, this.models[0].model, 0.015, [0, 1, 0]);
            this.Update();
            this.Render();

        }

        requestAnimationFrame(this.boundTick);

    }

    Run() {
        this.InitContext();

        this.LoadResources()

        this.Tick();
    }
}





