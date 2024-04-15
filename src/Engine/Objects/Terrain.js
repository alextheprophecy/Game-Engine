import Mesh from "../Geometry/Mesh.js";

class Terrain {

    constructor(width, height, spacing){
        this.generateTerrain(width,height,spacing)
        this.perlin.seed()
    }
 
    generateTerrain(width, length, spacing) {
        const vertices = [];
        const indices = [];
        const normals = []

        const height = 0;
    
        for (let z = 0; z < length; z++) {
            for (let x = 0; x < width; x++) {
                const xPos = x * spacing;
                const zPos = z * spacing;
                vertices.push(xPos, height, zPos); // Vertex position
                normals.push([0,1,0])
            }
        }
    
        for (let z = 0; z < length - 1; z++) {
            for (let x = 0; x < width - 1; x++) {
                const topLeft = z * width + x;
                const topRight = topLeft + 1;
                const bottomLeft = (z + 1) * width + x;
                const bottomRight = bottomLeft + 1;
    
                // Define two triangles for each square
                indices.push(topLeft, bottomRight, bottomLeft);
                indices.push(topLeft, topRight, bottomRight);
            }
        }
    
        //for(let i=0; i<vertices.length/3;i++) normals.push([0,1,0])
        this.normals = normals.flat()
        this.vertices = vertices
        this.indices = indices
    }

    getMesh(gl){
        const terrain = new Mesh(true)
        terrain.bufferData(gl, this.normals, 3, "normals")
        terrain.bufferData(gl, this.indices, 3, "index")
        terrain.bufferData(gl, this.vertices, 3, "positions")
        return terrain
    }

    perlin = {
        rand_vect: function(){
            let theta = Math.random() * 2 * Math.PI;
            return {x: Math.cos(theta), y: Math.sin(theta)};
        },
        dot_prod_grid: function(x, y, vx, vy){
            let g_vect;
            let d_vect = {x: x - vx, y: y - vy};
            if(!this.gradients) this.gradients = {}
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
           // if (this.memory.hasOwnProperty([x,y]))
            //    return this.memory[[x,y]];
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
           // this.memory[[x,y]] = v;
            return v;
        }
    }
}

export default Terrain