
export const Texture = {
    Albedo: 0,
    Normal: 1,
    Specular: 2,
}

export class BasicMaterial {
    /**
     * 
     * @param {Shader} shader Shader used for the material
     * @param {Texture} albedoText Color/albedo/diffuse texture URL (Nulleable)
     * @param {Texture} normalTex Normal texture URL (Nulleable)
     * @param {Texture} specularText Specular texture URLC (Nulleable)
     */
    constructor(id,shader, albedoText, normalTex, specularText) {

        this.id = id;
        this.shader = shader;

        //Textures
        this.albedoTexture = this.LoadTexture(albedoText);
        this.normalTexture = this.LoadTexture(normalTex);
        this.specularTexture = this.LoadTexture(specularText);


    }

    LoadTexture(imageRoute) {
        if(!imageRoute){
            return;
        }

        var textureID = this.shader.gl.createTexture();
        this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, textureID);
        this.shader.gl.texParameteri(this.shader.gl.TEXTURE_2D, this.shader.gl.TEXTURE_WRAP_S, this.shader.gl.CLAMP_TO_EDGE);
        this.shader.gl.texParameteri(this.shader.gl.TEXTURE_2D, this.shader.gl.TEXTURE_WRAP_T, this.shader.gl.CLAMP_TO_EDGE);
        this.shader.gl.texParameteri(this.shader.gl.TEXTURE_2D, this.shader.gl.TEXTURE_MIN_FILTER, this.shader.gl.LINEAR);
        this.shader.gl.texParameteri(this.shader.gl.TEXTURE_2D, this.shader.gl.TEXTURE_MAG_FILTER, this.shader.gl.LINEAR);
        this.shader.gl.texImage2D(
            this.shader.gl.TEXTURE_2D, 0, this.shader.gl.RGBA, this.shader.gl.RGBA,
            this.shader.gl.UNSIGNED_BYTE,
            document.getElementById(imageRoute)
        );
        this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, null);

        return textureID;

    }
    BindTextures(){

        this.shader.Use();

        if (this.albedoTexture != null) {
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.albedoTexture);
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE0);
        }

        if (this.normalTexture != null) {
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.normalTexture);
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE1);
        }

        if (this.specularTexture != null) {
            this.shader.gl.bindTexture(this.shader.gl.TEXTURE_2D, this.specularTexture);
            this.shader.gl.activeTexture(this.shader.gl.TEXTURE2);
        }

    }

}