import CubeMesh from "../Geometry/CubeMesh.js"
import Material from "../Shaders/Material.js"
import Shader from "../Shaders/Shader.js"
import Entity from "./Entity.js"
class PointLight{

    constructor(transform, brightness, colour=[1,1,1]){
        this.transform = transform
        this.brightness = brightness
        this.colour = colour
        this.shader = new Shader("./src/Resources/Shaders/light.vs.glsl", "./src/Resources/Shaders/light.fs.glsl")
        this.entity = null
    }

    load(gl){
        this.material = new Material(this.shader, this.colour) 
        this.entity = new Entity(new CubeMesh(gl, 0.1), this.material, this.transform)
        this.entity.init(gl)
        this.entity.mesh.material.setUniform('transformationMatrix', this.transform.transformationMatrix())
        return this.entity
    }
}

export default PointLight