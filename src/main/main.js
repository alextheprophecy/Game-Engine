import Material from "../Engine/Shaders/Material.js";
import Shader from "../Engine/Shaders/Shader.js";

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    loadResources(gl);
}

function loadResources(gl) {
    console.log("loading resources")
    let materials = []
    const mat1 = new Shader("../Engine/Shaders/vertshader.vs.glsl", "../Engine/Shaders/fragshader.fs.glsl")

    materials.push(mat1)
    Promise.all(materials.map(m=>m.createShaderProgram(gl))).then(()=>main(gl, materials)).catch(e=>console.log("error loading material list", e))
}

function main(gl, materials) {
    gl.useProgram(materials[0].shaderProgram);
    
    const vertices = [
        0, 0, 0,
        0, 0.5, 0,
        0.7, 0, 0
    ];
    
    // Create a buffer to store vertex data
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    // Get attribute locations from shader program
    const positionAttributeLocation = gl.getAttribLocation(materials[0].shaderProgram, 'a_position');
    
    // Enable the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}