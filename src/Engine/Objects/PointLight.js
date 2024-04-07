import Mesh from "../Geometry/Mesh.js"
import Material from "../Shaders/Material.js"
import Entity from "./Entity.js"
class PointLight{
    constructor(transform, brightness, colour=[1,1,1]){
        this.transform = transform
        this.brightness = brightness
        this.colour = colour
        //this.material =  new Material("../Resources/Shaders/terrain.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
        //this.entity = null
    }

  /*  init(gl){.then(()=>this.light.init(this.gl)
        const mesh = new Mesh(false)
        mesh.bufferData(gl, transform.position, "positions")
        this.entity = new Entity(mesh, this.material)
    } */
}

export default PointLight