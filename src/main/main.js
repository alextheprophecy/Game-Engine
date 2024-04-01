import MaterialInstance from "../Engine/Shaders/MaterialInstance.js";
import Material from "../Engine/Shaders/Material.js";
import CubeMesh from "../Engine/Geometry/CubeMesh.js";
import Camera from "../Engine/Objects/Camera.js";
import Entity from "../Engine/Objects/Entity.js";
import Transform from "../Engine/Geometry/Transform.js";

const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT);
    main(gl, canvas);
}


function main(gl, canvas) { 
    const camera = new Camera(canvas)
    const materials = []

    const material1 = new Material("../Engine/Shaders/vertshader.vs.glsl", "../Engine/Shaders/fragshader.fs.glsl")
    materials.push(material1)

    Promise.all(materials.map(m => m.createShaderProgram(gl))).then(()=>{

        const cube = new CubeMesh(gl)
        const entity = new Entity(cube, material1)
        entity.init(gl, camera)
        entity.mesh.material.setUniform("lightPosition", [0,1.5,3])
        entity.mesh.material.setUniform("lightColour", [1,1,1])
        
       /*// use e.keyCode
            if (keyboard.pressed("left")){
                
            }
         */

        document.addEventListener("keypress", function(event) {
            const rotSpeed = 0.05
            const x = camera.position[0]
            const z = camera.position[2]
            if (event.key === "a") {                
                camera.position[0] = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
                camera.position[2] = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
            }else if (event.key === "d") {
                camera.position[0] = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
                camera.position[2] = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
            }
            camera.recalculate()
          });
          


        var animate = function(time) {
            console.log(camera.position)

            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);          
            
            //entity.transform.rotate(0,1,0)
            entity.draw(gl)

            window.requestAnimationFrame(animate);
         }
         animate(0);
    })

}