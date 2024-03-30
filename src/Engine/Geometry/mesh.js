class Mesh {
    constructor() {
        this.buffers = {};  
    }
  
    //create and store data in buffer
    bufferData(info, name="index") {
        info.buffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, info.buffer);
        
        //smaller array if index
        if (name=="index") GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(info.data), GL.STATIC_DRAW);
        else GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(info.data), GL.STATIC_DRAW);

        this.buffers[name] = info;
    }
  
    bind(shader) {
      for (let k in this.buffers) {
        if (shader._attribs[k] == -1) {
          continue;
        }
  
        const b = this.buffers[k];
  
        if (k == 'index') {
          GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, b.buffer);
        } else {
          GL.bindBuffer(GL.ARRAY_BUFFER, b.buffer);
          GL.vertexAttribPointer(shader._attribs[k], b.size, GL.FLOAT, false, 0, 0);
          GL.enableVertexAttribArray(shader._attribs[k]);
        }
      }
    }
  
    draw() {
      const vertexCount = this.buffers.index.data.length;
      GL.drawElements(GL.TRIANGLES, vertexCount, GL.UNSIGNED_SHORT, 0);
    }
  }