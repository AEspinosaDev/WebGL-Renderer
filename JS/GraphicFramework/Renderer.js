import { Camera } from "./Camera.js";
import { Light } from "./Light.js";
import { Shader } from "./Shader.js";
import { mat4 } from "./Utils/gl-matrix/index.js";

var identityMatrix = new Float32Array(16);
mat4.identity(identityMatrix);

export const SHADER_TYPE = {
    Lit: 0,
    Unlit: 1,
}

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

        this.lights = new Array();
        this.lights.push(new Light([0,4,0],[1,1,1],1));


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
    /**
     * Load all resources needed for rendering (shaders,textures, geometry)
     */
    LoadResources() {
        this.LoadShaders();
    }
    /**
     * To implement by the user. Load shaders here.
     */
    LoadShaders() {
        new Shader(this, "lightGizmoShader", "../Resources/Shaders/LightGizmoShader.glsl",SHADER_TYPE.Unlit);
        //Load desired shaders...

    }
    /**
     * To implement by the user. Load textures here.
     */
    LoadTextures() {
        //Load desired textures...

    }
    /**
     * To implement by the user. Load models here. Models can be also be transformed here. Models need materials to be rendered. Materials can be instanced here. Lights here.
     */
    SetupScene() {
        //Load desired models and materials...

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
            this.SetupScene();
        }
    }

    UpdateLoadedModelsCount() {
        this.numModelsLoaded++;
        if (this.numModelsLoaded == this.models.length) {
            this.loaded = true; // allow rendering
        }
    }

   

    Update() {
        this.models.forEach(m => {
            m.Update();
        });
    }
    Render() {
        this.gl.clearColor(this.backgroundColor[0], this.backgroundColor[1], this.backgroundColor[2], this.backgroundColor[3]);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);

        //Lights
        this.shaders.forEach(s => {
            if(s.type == SHADER_TYPE.Lit){
            s.Use();
            s.SetVec3("lightPos",this.lights[0].pos[0],this.lights[0].pos[1],this.lights[0].pos[2]);
            s.SetVec3("lightColor",this.lights[0].color[0],this.lights[0].color[1],this.lights[0].color[2]);
            s.SetFloat("lightIntensity",this.lights[0].intensity);

            }
            //Albedo intensity

            
        });

        //Geometry
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





