import Mesh from "./Mesh.js";

class InstancesMesh extends Mesh {
    constructor(){
        super()
    }

    bufferData(gl, data, size, name, isPerInstance) {
        super.bufferData(gl, data, size, name, isPerInstance)
    }

    draw(gl, instances, mode=gl.TRIANGLES) {
        this.bind(gl, this.material)
        this.material.shader.use(gl)
        const vertexCount = this.vertexCount
        gl.drawArraysInstanced(mode, 0, vertexCount, instances);
    }
}

export default InstancesMesh