class Mesh {
    constructor(drawWithIndices=false) {
        this.buffers = {};  
        this.vertexCount = 0
        this.material = null
        this.drawWithIndices = drawWithIndices
    }
  
    //create and store data in buffer
    bufferData(gl, data, size, name, isPerInstance = false) {
        const buffer = gl.createBuffer();
     
        if(name=='positions'&&!this.drawWithIndices)this.vertexCount=data.length

        if (name == 'index'){
            const typedArr = new Uint16Array(data)
            this.vertexCount = typedArr.length
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedArr, gl.STATIC_DRAW);
        } else{
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        }


        const isMatrix = name.slice(0,2) === 'm_'

        this.buffers[name] = {buffer:buffer, size:size, isPerInstance:isPerInstance, isMatrix:isMatrix};
    }
  
    bind(gl, material=null) {
        if(!this.material)this.material = material
        
        for (let k in this.buffers) {
            if (material.attributes[k] == -1) continue
            const b = this.buffers[k]
    
            if (k == 'index') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.buffer)
            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer)
               
                if(!b.isMatrix){
                    gl.vertexAttribPointer(material.attributes[k], b.size, gl.FLOAT, false, 0, 0)
                    gl.enableVertexAttribArray(material.attributes[k])
                    gl.vertexAttribDivisor(material.attributes[k], b.isPerInstance)  //if using draw instanced              

                }else{  
                    const bytesPerMatrix = b.size * 16;
                    for (let i = 0; i < b.size; ++i) {
                      const loc = material.attributes[k] + i                      
                      const offset = i * 16 
                      gl.vertexAttribPointer(loc, b.size, gl.FLOAT, false, bytesPerMatrix, offset)
                      gl.enableVertexAttribArray(loc)
                      gl.vertexAttribDivisor(loc, b.isPerInstance)  //if using draw instanced              
                    }                  
                   
                }
                
            }
        }
        this.isBound = true
    }
  
    draw(gl, mode=gl.TRIANGLES) {
        this.bind(gl, this.material)
        const vertexCount = this.vertexCount
        if(this.drawWithIndices) gl.drawElements(mode, vertexCount, gl.UNSIGNED_SHORT, 0);
        else gl.drawArrays(mode, 0, vertexCount)
    }

    drawLight(gl) {
        this.bind(gl, this.material)
        const vertexCount = this.vertexCount
        gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);        
    }


}

export default Mesh