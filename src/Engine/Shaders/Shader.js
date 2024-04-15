class Shader {
  constructor(vurl, furl) {    
    this.vurl = vurl;
    this.furl = furl;
    this.vsrc = null;
    this.fsrc = null;
    this.shaderProgram = null;         
  }

  /**
   * creates shader program for given vsh and fsh and stores in this.shaderProgram when done 
   * @param {} gl 
   * @returns promise
   */
  load(gl){
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

        this.getParamLocations(gl)

    }).catch(e => console.error("Error loading shaders:", e));       
  }  


  /**
   * gets and stores locations of all attributes and uniforms for this material
   * @param {} gl 
   */
  getParamLocations(gl){
    this.attributes = {
      positions: gl.getAttribLocation(this.shaderProgram, 'position'),
      uvs: gl.getAttribLocation(this.shaderProgram, 'uv0'),
      colours: gl.getAttribLocation(this.shaderProgram, 'colour'),
      normals: gl.getAttribLocation(this.shaderProgram, 'normal'),
      m_transforms: gl.getAttribLocation(this.shaderProgram, 'm_transform'),
      m_transformss: gl.getAttribLocation(this.shaderProgram, 'm_transform2'),
    };

    this.uniforms = {
      projectionMatrix: {
        type: 'mat4',
        location: gl.getUniformLocation(this.shaderProgram, 'projectionMatrix')
      },
      modelViewMatrix: {
        type: 'mat4',
        location: gl.getUniformLocation(this.shaderProgram, 'modelViewMatrix'),
      },
      cameraPosition: {
        type: 'vec3',
        location: gl.getUniformLocation(this.shaderProgram, 'cameraPosition'),
      },
      transformationMatrix: {
        type: 'mat4',
        location: gl.getUniformLocation(this.shaderProgram, 'transformationMatrix'),
      },
      lightPositions: {
        type: 'vec3',
        location: gl.getUniformLocation(this.shaderProgram, 'lightPositions'),
      },
      lightColours: {
        type: 'vec4',
        location: gl.getUniformLocation(this.shaderProgram, 'lightColours'),
      },
      lightColour: {
        type: 'vec3',
        location: gl.getUniformLocation(this.shaderProgram, 'lightColour'),
      },
      objectColour: {
        type: 'vec3',
        location: gl.getUniformLocation(this.shaderProgram, 'objectColour'),
      },
      fogColour: {
        type: 'vec4',
        location: gl.getUniformLocation(this.shaderProgram, 'u_fogColour'),
      },
      fogDensity: {
        type: 'float',
        location: gl.getUniformLocation(this.shaderProgram, 'u_fogDensity'),
      },
      fogStart: {
        type: 'float',
        location: gl.getUniformLocation(this.shaderProgram, 'u_fogStart'),
      },
      texture: {
        type: 'texture',
        location: gl.getUniformLocation(this.shaderProgram, 'u_texture'),
      }
    };
  }

  /**
   * set gl to use this current shader program
   * @param {*} gl 
   */
  use(gl){
    gl.useProgram(this.shaderProgram)
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