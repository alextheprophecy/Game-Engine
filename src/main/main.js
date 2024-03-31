import Material from "../Engine/Shaders/Material.js";
import Shader from "../Engine/Shaders/Shader.js";
import Mesh from "../Engine/Geometry/mesh.js";

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    main(gl);
}


function main(gl) {    
    const vertices = [
        0, 0, 0,
        0, 1, 0,
        1, 0, 0,
        1, 1, 0
    ];

    const indices = [
        0, 1, 2,
        1, 3, 2
    ]

    gl.clear(gl.COLOR_BUFFER_BIT);
    

    const shader1 = new Shader("../Engine/Shaders/vertshader.vs.glsl", "../Engine/Shaders/fragshader.fs.glsl")
    shader1.createShaderProgram(gl).then(()=>{
        const mat2 = new Material(shader1);

        const triangle = new Mesh()
        triangle.bufferData(gl, indices, 3, "index")
        triangle.bufferData(gl, vertices, 3, "positions")
       

        triangle.setMaterial(gl, mat2)
        triangle.draw(gl)
    })

}