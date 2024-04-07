import Mesh from "../Geometry/Mesh.js"
import Entity from "./Entity.js"
import PointLight from "./PointLight.js"
import MeshLoader from "../Utils/MeshLoader.js"

class Scene {
    constructor(gl, camera, light, materials){
        this.gl = gl
        this.camera = camera
        this.light = light
        this.materials = materials
        this.meshLoader = new MeshLoader()
        this.entityList = []
        
    }

    init(){    
        return Promise.all(this.materials.map(m => m.load(this.gl)))
    }

    /**
     * add Object to scene to render
     * @param {*} obj 
     */
    addObject(obj, colour=null){
        switch(obj.constructor){
            case Entity:
                obj.init(this.gl, this.camera)
                
                obj.mesh.material.setUniform("lightPosition", this.light.transform.position)
                obj.mesh.material.setUniform("lightColour", this.light.colour)
                if(colour)obj.mesh.material.setColour(colour)

                this.entityList.push(obj)
                break
            case PointLight:
                console.warn("not yet implemented multiple lights in scene")
                break                
        }
    }

    /**
     * input a mesh or a promise of a mesh
     * @param {} mesh 
     * @param {*} transform 
     * @param {*} material 
     */
    createEntity(mesh, material, transform=null, colour=null){
        const meshPromise = () => {
            if(mesh.constructor === String){ //load mesh from Url
                return this.meshLoader.load(this.gl, mesh).then(m=>m)
            }
            return mesh
        }
        return Promise.resolve(meshPromise()).then((m)=>{
            const entity = new Entity(m, material, transform)
            this.addObject(entity, colour)
            return entity
        })
    }

    render(){
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT); 
        this.entityList.forEach(e=>e.draw(this.gl, this.camera))
      
    }
}

export default Scene