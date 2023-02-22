
export const Texture = {
    Albedo: 0,
    Normal: 1,
    Specular: 2,
}

export class BasicMaterial {
    /**
     * 
     * @param {renderer} renderer reference to renderer
     * @param {String} id identification
     * @param {Shader} shader Shader used for the material
     * @param {String} albedoTextName Color/albedo/diffuse texture ID (Nulleable)
     * @param {String} normalTexName Normal texture ID (Nulleable)
     * @param {String} specularText Specular texture ID (Nulleable)
     */
    constructor(renderer, id, shader, albedoTextName, normalTexName, specularTextName) {

        this.shader = renderer.shaders.get(shader);
        renderer.materials.set(id,this);
        this.id = id;

        //Textures
        this.albedoTextureID = renderer.textures.get(albedoTextName);
        this.normalTextureID = renderer.shaders.get(normalTexName);
        this.specularTextureID = renderer.shaders.get(specularTextName);
        // console.log(this.specularTextureID);


    }


    BindTextures() {

        this.shader.Use();


        if (this.albedoTextureID != null) {
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE0);
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.albedoTextureID);
            this.shader.SetInt("albedoText", this.shader.gl.TEXTURE0);
        }

        if (this.normalTextureID != null) {
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE1);
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.normalTextureID);
            this.shader.SetInt("normalText", this.shader.gl.TEXTURE1);
        }

        if (this.specularTextureID != null) {
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE2);
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.specularTextureID);
            this.shader.SetInt("specularText", this.shader.gl.TEXTURE2);
        }

    }
   

}