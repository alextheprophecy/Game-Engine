import Mesh from "../Geometry/Mesh.js"
import Entity from "./Entity.js"
import PointLight from "./PointLight.js"
import MeshLoader from "../Utils/MeshLoader.js"
import GrassArea from "./GrassArea.js"

class Scene {
    constructor(gl, camera, lights, shaders){
        this.gl = gl
        this.camera = camera
        this.lights = lights
        this.shaders = shaders.concat(this.lights.map(l=>l.shader))
        this.meshLoader = new MeshLoader()
        this.entityList = []   
        this.renderModeTriangles = true     
    }

    init(){    
        return Promise.all(this.shaders.map(s => s.load(this.gl))).then(() => this.lights.map(l => l.load(this.gl)))
    }

    keyPress(event){
        if (event.code === "ShiftLeft") {  
            this.renderModeTriangles = !this.renderModeTriangles
        }else if (event.key === "d") {
        }
    }

    /**
     * add Object to scene to render
     * @param {*} obj 
     */
    addObject(obj, colour=null){
        switch(obj.constructor){
            case Entity:
                obj.init(this.gl)
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
        this.entityList.forEach(e=>e.draw(this.gl, this.camera, this.lights, this.renderModeTriangles?this.gl.TRIANGLES:this.gl.LINES))
        this.lights.forEach(l=>l.entity.drawLight(this.gl, this.camera))
    }
}

export default Scene