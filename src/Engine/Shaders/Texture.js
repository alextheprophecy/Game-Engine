class Texture {

    constructor(src){
        this.src = src
        this.texture = null
    }

    loadAsTexture(gl) {
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                      1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                      new Uint8Array([0, 0, 255, 255]));
    
        const img = new Image();
        img.src = this.src;
        img.onload = () => {

            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);  
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
           
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
        return this
    }

    loadAsCubeMap(gl){
      this.texture = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
      const orientations = [gl.TEXTURE_CUBE_MAP_POSITIVE_X,  gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z]
      this.src.forEach((url, i) => {
        const target = orientations[i]
        // Upload the canvas to the cubemap face.
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 512;
        const height = 512;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;

        // setup each face so it's immediately renderable
        gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

         // Asynchronously load an image
        const image = new Image();
        image.src = url;
        image.onload = () => {
          gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
          gl.texImage2D(target, level, internalFormat, format, type, image);
          gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        };
      });

      gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
      gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      return this
    }
  
    bind(gl, index, isCubeMap=false) {
      if (!this.texture) {
        return;
      }
      gl.activeTexture(gl.TEXTURE0 + index);
      gl.bindTexture(isCubeMap?gl.TEXTURE_CUBE_MAP:gl.TEXTURE_2D, this.texture);
    }
  
    unBind() {
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export default Texture