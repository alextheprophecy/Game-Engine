import Transform from "../Geometry/Transform.js"
import Material from "../Shaders/Material.js";
const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

class Entity {
    constructor(mesh, material, transform=null){
        this.mesh = mesh
        this.material = material         
        this.transform = transform?transform:new Transform()
    }

    init(gl){
        this.mesh.bind(gl, this.material)
    }

    draw(gl, camera, lights){
        if(!this.mesh.material)console.log("!!Warning!! initialise entity to setup material instance for mesh")  
        this.mesh.material.setUniform('transformationMatrix', this.transform.transformationMatrix())
        this.mesh.material.update(gl, camera, lights)
        this.mesh.draw(gl)
    }

    drawLight(gl, camera){
        if(!this.mesh.material)console.log("!!Warning!! initialise entity to setup material instance for mesh") 
        this.mesh.material.setUniform('transformationMatrix', this.transform.transformationMatrix())
        this.mesh.material.update(gl, camera)
        this.mesh.drawLight(gl)
    }
}

export default Entity