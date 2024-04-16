import Mesh from "../Geometry/Mesh.js";

class MeshLoader{
    
    loadMesh(gl, url){
        return this.getData(url).then(result => {
            const mesh = new Mesh(false)
            mesh.bufferData(gl, result.normals, 3, "normals")
            mesh.bufferData(gl, result.positions, 3, "positions")
            mesh.bufferData(gl, result.uvs, 2, "uvs") //weird bug, fix: every second uv is flipped (1-uv)
            return mesh
          })        
    }


    getData(url) {
      console.log(url)
      return fetch(url).then(response =>
        response.text().then(text=> {
          // because indices are base 1 let's just fill in the 0th data
          const objPositions = [[0,0,0]];
          const objTexcoords = [[0,0]];
          const objNormals = [[0,0,0]];
          
          const objVertexData = [
            objPositions,
            objTexcoords,
            objNormals,
          ];

          let finalData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
          ];
        
          function addVertex(vert) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
              if (!objIndexStr) {
                return;
              }
              const objIndex = parseInt(objIndexStr)
              const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
              finalData[i].push(...objVertexData[i][index]);
            });
          }

          
              
          const keywords = { 
            v(parts) {
              objPositions.push(parts.map(parseFloat));
            },
            vn(parts) {
              objNormals.push(parts.map(parseFloat));
            },
            vt(parts) {
              objTexcoords.push(parts.map(parseFloat));
            },
            f(parts) {
              const numTriangles = parts.length - 2;
              for (let tri = 0; tri < numTriangles; ++tri) {
                addVertex(parts[0]);
                addVertex(parts[tri + 1]);
                addVertex(parts[tri + 2]);
              }
            },
          };
        
          const keywordRE = /(\w*)(?: )*(.*)/;
          const lines = text.split('\n');
          for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
            const line = lines[lineNo].trim();
            if (line === '' || line.startsWith('#')) {
              continue;
            }
            const m = keywordRE.exec(line);
            if (!m) {
              continue;
            }
            const [, keyword, unparsedArgs] = m;
            const parts = line.split(/\s+/).slice(1);
            const handler = keywords[keyword];
            if (!handler) {
              //console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
              continue;
            }
            handler(parts, unparsedArgs);
          }
          
          const [positions, uvs, normals] = finalData

          const scale = 1.75
          
          return {normals: normals, positions: positions.map(p=>p*scale), uvs: uvs.map((u,i)=>i%2==0?u:1-u)}       
        })).catch(e=>console.log(e, url))
    }

  
}

export default MeshLoader