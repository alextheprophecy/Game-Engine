import Material from "../Engine/Shaders/Material.js";
import CubeMesh from "../Engine/Geometry/CubeMesh.js";
import Camera from "../Engine/Objects/Camera.js";
import Transform from "../Engine/Geometry/Transform.js";
import MeshLoader from "../Engine/Utils/MeshLoader.js";
import PointLight from "../Engine/Objects/PointLight.js";
import Scene from "../Engine/Objects/Scene.js";
import Terrain from "../Engine/Objects/Terrain.js";
const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.8, 0.8, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    main(gl, canvas);
}

 
function main(gl, canvas) { 

    const camera = new Camera(canvas)
    
    const materials = []
    const material1 = new Material("../Engine/Shaders/vertshader.vs.glsl", "../Engine/Shaders/fragshader.fs.glsl")
    materials.push(material1)

    const pointLight = new PointLight(new Transform([3,1.5,3]), 2, [1,1,1])

    const scene = new Scene(gl, camera, pointLight, materials)

    scene.init().then(()=>{
        document.addEventListener("keypress", function(event) {
            camera.move(event)
        });

        const terrain = new Terrain()

        scene.createEntity(terrain.getMesh(gl), material1, new Transform([-10,-1,-10]), [0,1,0])
        scene.createEntity(new CubeMesh(gl), material1, new Transform([-2,0,2]), [0,0,1])
        scene.createEntity('../Resources/Models/human.obj', material1, new Transform([0,-1,0]))
        scene.createEntity('../Resources/Models/Tree02.obj', material1, new Transform([5,-1,0]), [1,1,0])

        var animate = function(time) {
            scene.render()
            window.requestAnimationFrame(animate);
        }
        animate(0);
    })

}