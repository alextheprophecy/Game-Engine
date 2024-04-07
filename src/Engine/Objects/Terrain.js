import Mesh from "../Geometry/Mesh.js";

class Terrain extends Mesh {

    constructor(width, height, spacing){
        super()
        this.generateTerrain(width,height,spacing)
    }
 
    generateTerrain(width, length, spacing) {
        const vertices = [];
        const indices = [];
        const height = 0;
    
        for (let z = 0; z < length; z++) {
            for (let x = 0; x < width; x++) {
                const xPos = x * spacing;
                const zPos = z * spacing;
                vertices.push(xPos, height, zPos); // Vertex position
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
    
        const normals = []
        for(let i=0; i<vertices.length/3;i++) normals.push([0,1,0])
        this.normals = normals.flat()
        this.vertices = vertices
        this.indices = indices
    }

    getMesh(gl){
        const terrain = new Mesh()
        terrain.bufferData(gl, this.normals, 3, "normals")
        terrain.bufferData(gl, this.indices, 3, "index")
        terrain.bufferData(gl, this.vertices, 3, "positions")
        return terrain
    }
}

export default Terrain