import Transform from "../Geometry/Transform.js"
import MaterialInstance from "../Shaders/MaterialInstance.js";

class Entity {
    constructor(mesh, materialSource, transform=null){
        this.mesh = mesh
        this.materialSource = materialSource         
        this.transform = transform?transform:new Transform()
    }

    init(gl, camera){
        this.camera = camera
        const material = new MaterialInstance(this.materialSource, camera);
        this.mesh.bind(gl, material)
    }

    draw(gl){      
        if(!this.mesh.material)console.log("!!Warning!! initialise entity to setup material instance for mesh")  
        this.mesh.material.setUniform('transformationMatrix', this.transform.transformationMatrix())
        this.mesh.material.setUniform('projectionMatrix', this.camera.projectionMatrix)
        this.mesh.material.setUniform('modelViewMatrix', this.camera.viewMatrix)
        this.mesh.material.setUniform('cameraPosition', this.camera.position)
        this.mesh.material.update(gl)
        this.mesh.draw(gl)
    }
}

export default Entity