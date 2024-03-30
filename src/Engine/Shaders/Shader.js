class Shader {
  constructor(vsrc, fsrc) {    
    this.vsrc = vsrc  
    this.fsrc = fsrc
    this.shaderProgram = null;         
  }

  /**
   * creates shader program for given vsh and fsh and stores in this.shaderProgram when done 
   * @param {} gl 
   * @returns promise
   */
  createShaderProgram(gl){
    return Promise.all([
        this.loadShaderFile(this.vurl),
        this.loadShaderFile(this.furl)
    ]).then(sources => {
        this.vsrc = sources[0];
        this.fsrc = sources[1];
        // Create vertex shader
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, this.vsrc);
        gl.compileShader(vertexShader);
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            console.error("Vertex shader compilation error: " + gl.getShaderInfoLog(vertexShader));
            return;
        }

        // Create fragment shader
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, this.fsrc);
        gl.compileShader(fragmentShader);
        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            console.error("Fragment shader compilation error: " + gl.getShaderInfoLog(fragmentShader));
            return;
        }

        // Create shader program
        this.shaderProgram = gl.createProgram();
        gl.attachShader(this.shaderProgram, vertexShader);
        gl.attachShader(this.shaderProgram, fragmentShader);
        gl.linkProgram(this.shaderProgram);
        if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
            console.error("Shader program linking error: " + gl.getProgramInfoLog(this.shaderProgram));
            return;
        }
        console.log("Shader program created successfully");
    }).catch(e => console.error("Error loading shaders:", e));       
  }  

  /**
   * 
   * @param {*} url 
   * @returns a promise with shader source data
   */
  loadShaderFile(url) {
    return new Promise((res, rej) => {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    res(xhr.responseText);
                } else {
                    rej(new Error("Failed to load shader file: " + url));
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    });
}
}

export default Shader