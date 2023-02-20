export class Texture{
    constructor(renderer,name,route){

            this.name = name;
            this.id = this.LoadTexture(route,renderer.gl,renderer.textureLoadedCallback);
            renderer.textures.set(name,this.id);

    }

    LoadTexture(imageRoute,gl,callback) {
        if (!imageRoute) {
            return;
        }

        var textureID = gl.createTexture();

        textureID.image = new Image();
        textureID.image.src = imageRoute;
        textureID.image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, textureID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureID.image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);

            if (textureID.image && textureID.image.src) {
                console.log('Loaded texture ' + imageRoute + ' [' + textureID.image.width + 'x' + textureID.image.height + ']');
            }

            callback && callback();
        };

        return textureID;
    }


}