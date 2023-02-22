import { Renderer, SHADER_TYPE } from "./GraphicFramework/Renderer.js";
import { BasicMaterial } from "./GraphicFramework/BasicMaterial.js";
import { Shader } from "./GraphicFramework/Shader.js";
import { Model } from "./GraphicFramework/Model.js";
import { Texture } from "./GraphicFramework/Texture.js";

window.addEventListener('DOMContentLoaded',()=>{

    class DemoRenderer extends Renderer{
        LoadShaders() {
            super.LoadShaders();
            new Shader(this, "diffuseShader", "../Resources/Shaders/DiffuseShader.glsl",SHADER_TYPE.Lit);
        }
        LoadTextures() {
            // new Texture(this,"albedoCrate", "../Resources/Textures/crate.png");
            new Texture(this,"crateNormal", "../Resources/Textures/SeamlessWood-NormalMap.png");
            new Texture(this,"crateAlbedo", "../Resources/Textures/SeamlessWood-Albedo.png");
            new Texture(this,"glossMap", "../Resources/Textures/SeamlessWood-GlossMap.png");
            new Texture(this,"floor", "../Resources/Textures/floor.jpg");
            new Texture(this,"floor-normal", "../Resources/Textures/floor-normal.jpg");

        }

        SetupScene() {
            super.SetupScene();

            new BasicMaterial(this, "standardMat", "diffuseShader", "crateAlbedo","crateNormal", "glossMap");
            new BasicMaterial(this, "floorMat", "diffuseShader", "floor",null, null);
            new BasicMaterial(this, "mierda", "gizmoShader", null,null,null);

            // var box = new Model(this, "../Resources/Models/warrior-test.json", "mierda");
            // var box1 = new Model(this, "../Resources/Models/test-box.json", [diffuseMat]);
            var floor = new Model(this, "../Resources/Models/floor.json", "floorMat");
            var box2 = new Model(this, "../Resources/Models/test-box.json", "standardMat");
            // var box2 = new Model(this, "../Resources/Models/test-box.json", "standardMat");

            // box.Scale([0.02, 0.02, 0.02]);
            // box.Translate([-2, 0, 0]);
            box2.Scale([1, 1, 1]);
            box2.Translate([2, 0, 0]);
            floor.Translate([0,0,-2]);
            // floor.Scale([0.1, 0.1, 0.1]);
        }

    }

    var r = new DemoRenderer();
    r.Run();
})


