import InstancesMesh from "../Geometry/InstancesMesh.js";
import Mesh from "../Geometry/Mesh.js";
import Transform from "../Geometry/Transform.js";

class GrassArea {
    constructor(gl, material, transform, width, depth, density){
        this.gl = gl
        this.material = material
        this.width = width
        this.transform = transform
        this.depth = depth
        this.density = density
        this.init()
    }

    init(){
        let vertices = []
        let normals = []
        let colours = []

        //this.count = this.width*this.depth*this.density
        const m = Math.sqrt(this.density)
        const wSpacing = 1/(m)
        const dSpacing = 1/(m)

        const randomOffset = 0.5


        let transforms = []
        this.count = 0
        for (let x=0;x<this.width;x+=wSpacing){
            for (let z=0;z<this.depth;z+=dSpacing){
                this.count++
                const t = new Transform([x - randomOffset + Math.random()*randomOffset,0,z- randomOffset + Math.random()*randomOffset], [0,Math.random()*180,0])
                transforms.push(t.transformationMatrix());
            }
        }
        transforms = transforms.map(a => [...a]).flat();
        vertices = [-0.1,0,0, 0.1,0,0, 0,1.5,0]
        colours = [0.2,0.4,0, 0.2,0.4,0, 0,1,0]
        normals = [0,0,1,0,0,1,0,0,1]

        const grass = new InstancesMesh(false)
        
        grass.bufferData(this.gl, normals, 3, "normals")
        grass.bufferData(this.gl, vertices, 3, "positions")
        grass.bufferData(this.gl, colours, 3, "colours")
        grass.bufferData(this.gl, transforms, 4, "m_transforms", true)

        grass.bind(this.gl, this.material)

        this.grass = grass
        this.grass.material.setUniform('transformationMatrix', this.transform.transformationMatrix()) 
        this.grass.material.setUniform('lightPositions', [0,-5,5]) 
        this.grass.material.setUniform('lightColour', [1,1,1]) 

        console.log(this.grass.material.shader.attributes)
    }

    render(camera, lights){
        this.grass.material.update(this.gl, camera)
        this.grass.draw(this.gl, this.count)
    }
}

export default GrassArea