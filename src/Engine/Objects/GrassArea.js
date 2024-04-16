import InstancesMesh from "../Geometry/InstancesMesh.js";
import Mesh from "../Geometry/Mesh.js";
import Transform from "../Geometry/Transform.js";
import MeshLoader from "../Utils/MeshLoader.js";

class GrassArea {
    constructor(gl, material, transform, width, depth, density){
        this.gl = gl
        this.material = material
        this.width = width
        this.transform = transform
        this.depth = depth
        this.density = density
        this.meshLoader = new MeshLoader()
        this.init()
        
    }

    init(){
        this.perlin.seed()
        this.meshLoader.getData('../Resources/Models/grassBladeRectangular.obj').then((mesh)=>{
            let vertices = []
            let normals = []
            let colours = []
    
            //this.count = this.width*this.depth*this.density
            const m = Math.sqrt(this.density)
            const wSpacing = 1/(m)
            const dSpacing = 1/(m)
    
            const randomOffset = 0.5
    
    
            let transforms = []
            let instanceIds = []

            this.count = 0
            for (let x=0;x<this.width;x+=wSpacing){
                for (let z=0;z<this.depth;z+=dSpacing){
                    this.count++
                    const t = new Transform([x - randomOffset + Math.random()*randomOffset,0,z- randomOffset + Math.random()*randomOffset], [0,Math.random()*360,0])
                    transforms.push(t.transformationMatrix());
                    const n = this.perlin.get(x/this.width, z/this.depth)
                    instanceIds.push(n)
                    instanceIds.push(this.perlin.get(n, (z+x)/(2*this.depth)))
                }
            }
            transforms = transforms.map(a => [...a]).flat();  
    
            const grass = new InstancesMesh(false)
            
            //vertex data
            grass.bufferData(this.gl, mesh.normals, 3, "normals")
            grass.bufferData(this.gl, mesh.positions.map(e=>e*0.08), 3, "positions")
            grass.bufferData(this.gl, mesh.uvs, 2, "uvs")

            //grass instance data
            grass.bufferData(this.gl, transforms, 4, "m_transforms", true)
            grass.bufferData(this.gl, instanceIds, 2, "instanceIds", true)
    
            grass.bind(this.gl, this.material)
            grass.material.setUniform('transformationMatrix', this.transform.transformationMatrix()) 

            this.grass = grass
        })        
    }

    render(time, camera, lights, playerPosition){
        if(!this.grass)return
        this.grass.material.update(this.gl, camera, lights)
        this.grass.material.setUniform('time', time*0.0015)
        this.grass.material.setUniform('playerPosition', playerPosition)
        this.grass.draw(this.gl, this.count)
    }

    perlin = {
        rand_vect: function(){
            let theta = Math.random() * 2 * Math.PI;
            return {x: Math.cos(theta), y: Math.sin(theta)};
        },
        dot_prod_grid: function(x, y, vx, vy){
            let g_vect;
            let d_vect = {x: x - vx, y: y - vy};
            if (this.gradients[[vx,vy]]){
                g_vect = this.gradients[[vx,vy]];
            } else {
                g_vect = this.rand_vect();
                this.gradients[[vx, vy]] = g_vect;
            }
            return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        },
        smootherstep: function(x){
            return 6*x**5 - 15*x**4 + 10*x**3;
        },
        interp: function(x, a, b){
            return a + this.smootherstep(x) * (b-a);
        },
        seed: function(){
            this.gradients = {};
            this.memory = {};
        },
        get: function(x, y) {
            if (this.memory.hasOwnProperty([x,y]))
                return this.memory[[x,y]];
            let xf = Math.floor(x);
            let yf = Math.floor(y);
            //interpolate
            let tl = this.dot_prod_grid(x, y, xf,   yf);
            let tr = this.dot_prod_grid(x, y, xf+1, yf);
            let bl = this.dot_prod_grid(x, y, xf,   yf+1);
            let br = this.dot_prod_grid(x, y, xf+1, yf+1);
            let xt = this.interp(x-xf, tl, tr);
            let xb = this.interp(x-xf, bl, br);
            let v = this.interp(y-yf, xt, xb);
            this.memory[[x,y]] = v;
            return v*0.5;
        }
    }
}

export default GrassArea