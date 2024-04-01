class Mesh {
    constructor() {
        this.buffers = {};  
        this.vertexCount = 0
        this.material = null
    }
  
    //create and store data in buffer
    bufferData(gl, data, size, name) {  
        const buffer = gl.createBuffer();
     
        if (name == 'index'){
            const typedArr = new Uint16Array(data)
            this.vertexCount = typedArr.length
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, typedArr, gl.STATIC_DRAW);
        } else{
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        }

        this.buffers[name] = {buffer:buffer, size:size};
    }
  
    bind(gl, material) {
        this.material = material
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        for (let k in this.buffers) {
            if (material.attributes[k] == -1) continue;
            const b = this.buffers[k];
    
            if (k == 'index') {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b.buffer);
            }else{
                gl.bindBuffer(gl.ARRAY_BUFFER, b.buffer);
                gl.vertexAttribPointer(material.attributes[k], b.size, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(material.attributes[k]);
            }
        }
    }
  
    draw(gl) {
       this.material.shader.use(gl)
       const vertexCount = this.vertexCount
       gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);
    }
  }

  export default Mesh