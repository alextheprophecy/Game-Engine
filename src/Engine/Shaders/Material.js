class Material {

    constructor(shader) {
        this.shader = shader 
        this.attributes = {...this.shader.attributes}
        this.uniforms = {}
        for (let u in this.shader.uniforms){
            this.uniforms[u] = {
                location : this.shader.uniforms[u].location,
                type : this.shader.uniforms[u].type,
                value : null
            }
        }        
    }  

    setUniform(name, value) {
        if (this.uniforms[name])this.uniforms[name].value = value;
        else console.error('Uniform does not exist');
    }

    applyUniforms(gl) {
        this.shader.use(gl)

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
                    default:
                        console.warn(`Unsupported uniform type for ${uniformName}.`);
                }
            }
        }
    }
}


export default Material