import Mesh from "../Geometry/Mesh.js"
const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

class SkyBox extends Mesh{

    constructor(){
        super()
    }


    init(gl, material, texture){
        this.gl = gl
        const positions2d =[-1, -1, 1, -1, -1,  1, -1,  1, 1, -1, 1,  1]
        this.bufferData(gl, positions2d, 2, "positions")
        this.bind(gl, material)

        this.material.setUniform('skyBox', texture)

    }

    render(camera){      
        this.material.setUniform('viewDirectionProjectionInverse', camera.getViewDirProjInvMat())
        this.material.update(this.gl, camera)
        this.draw(this.gl)
    }
}

export default SkyBox