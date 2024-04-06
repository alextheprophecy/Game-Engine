import Transform from "../Geometry/Transform.js"
import MaterialInstance from "../Shaders/MaterialInstance.js";
const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

class Entity {
    constructor(mesh, materialSource, transform=null){
        this.mesh = mesh
        this.materialSource = materialSource         
        this.transform = transform?transform:new Transform()
    }

    init(gl){
        const material = new MaterialInstance(this.materialSource);
        this.mesh.bind(gl, material)
    }

    draw(gl, camera){
        if(!this.mesh.material)console.log("!!Warning!! initialise entity to setup material instance for mesh")  
        this.mesh.material.setUniform('transformationMatrix', this.transform.transformationMatrix())
        this.mesh.material.setUniform('projectionMatrix', camera.projectionMatrix)
        this.mesh.material.setUniform('modelViewMatrix', camera.viewMatrix)
        this.mesh.material.setUniform('cameraPosition', camera.position)
        this.mesh.material.setUniform('fogColour', [0.8, 0.8, 1, 1])
        this.mesh.material.setUniform('fogDensity', 0.045)
        this.mesh.material.setUniform('fogStart', 3.0)
        this.mesh.material.setUniform('fogStart', 3.0)
        this.mesh.material.update(gl)
        this.mesh.draw(gl)
    }
}

export default Entity