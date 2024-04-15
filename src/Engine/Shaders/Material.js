class Material {
    defaultColour = [0.8,0.2,0.42]
    defaultFogData = {'fogColour': [0.05,0,0.1, 1], 'fogDensity': 0.025, 'fogStart': 0}//'fogColour': [0.8, 0.8, 1, 1]

    constructor(shader, colour =null, texture=null, fogData = null) {
        this.shader = shader 
        this.attributes = {...this.shader.attributes}
        this.uniforms = {}
        for (let u in this.shader.uniforms){
            if(this.shader.uniforms[u].location!==null){
                this.uniforms[u] = {
                    location : this.shader.uniforms[u].location,
                    type : this.shader.uniforms[u].type,
                    value : null
                }
            }
        }     

        this.setUniform("texture", texture)
        this.setColour(colour?colour:this.defaultColour)
        const fogUniformData = fogData?fogData:this.defaultFogData
        this.setUniform('fogColour', fogUniformData.fogColour)
        this.setUniform('fogDensity', fogUniformData.fogDensity)
        this.setUniform('fogStart', fogUniformData.fogStart)
    }  

    setColour(colour){ this.setUniform("objectColour", colour);}

    setUniform(name, value) {
        if (this.uniforms[name])this.uniforms[name].value = value;
    }

    /**
     * apply uniforms
     * @param {} gl 
     */
    update(gl, camera=null, lights=null) {
        this.shader.use(gl)
        if(camera){
            this.setUniform('projectionMatrix', camera.projectionMatrix)
            this.setUniform('modelViewMatrix', camera.viewMatrix)
            this.setUniform('cameraPosition', camera.position)
        }
        //TODO: remove these they are called when creating entity in scene
        if(lights){
            this.setUniform("lightPositions", lights.map(l=>l.transform.position).flat())
            this.setUniform("lightColours", lights.map(l=>l.colour.concat(l.brightness)).flat())
        }
        

        let textureIndex = 0;

        for (let uniformName in this.uniforms) {
            const uniform = this.uniforms[uniformName];
            const loc = uniform.location;
            const val = uniform.value;

            if (loc !== null && val !== null) {
                switch (uniform.type) {
                    case 'mat4':
                        gl.uniformMatrix4fv(loc, false, val);
                        break;
                    case 'float':
                        gl.uniform1f(loc, val);
                        break;
                    case 'vec2':
                        gl.uniform2fv(loc, val);
                        break;
                    case 'vec3':
                        gl.uniform3fv(loc, val);
                        break;
                    case 'vec4':
                        gl.uniform4fv(loc, val);
                        break;
                    case 'texture':
                        val.bind(gl, 0)
                        gl.uniform1i(loc, textureIndex);
                        textureIndex++;                       
                        break;
                    default:
                        console.warn(`Unsupported uniform type for ${uniformName}.`);
                }
            }
        }
    }
}


export default Material