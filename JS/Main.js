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
            
        }
        
        SetupScene() {
            super.SetupScene();
            
            var diffuseMat = new BasicMaterial(this, 0, "diffuseShader", "crateAlbedo","crateNormal", "glossMap");
            var basuraMat = new BasicMaterial(this, 1, "lightGizmoShader", null,null,null);
    
            var box = new Model(this, "../Resources/Models/warrior-test.json", [basuraMat]);
            // var box1 = new Model(this, "../Resources/Models/test-box.json", [diffuseMat]);
            var box2 = new Model(this, "../Resources/Models/test-box.json", [diffuseMat]);
    
            box.Scale([0.02, 0.02, 0.02]);
            box.Translate([-2, 0, 0]);
            box2.Scale([2, 2, 2]);
            box2.Translate([2, 0, 0]);
        }

    }

    var r = new DemoRenderer();
    r.Run();
})


