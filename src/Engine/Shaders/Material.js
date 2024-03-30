class Material {

    constructor(shader, params) {
        this.shader = shader 
        this.init()         
    }

    init(){
        this.attribs = {
            positions: GL.getAttribLocation(this.shader, 'position'),
            normals: GL.getAttribLocation(this.shader, 'normal'),
            uvs: GL.getAttribLocation(this.shader, 'uv0'),
            colours: GL.getAttribLocation(this.shader, 'colour'),
          };
      
          this.uniforms = {
            projectionMatrix: {
              type: 'mat4',
              location: GL.getUniformLocation(this.shader, 'projectionMatrix')
            },
            modelViewMatrix: {
              type: 'mat4',
              location: GL.getUniformLocation(this.shader, 'modelViewMatrix'),
            }
          };   
    }   

}


export default Material