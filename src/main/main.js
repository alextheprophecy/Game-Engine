import Material from "../Engine/Shaders/Material.js";
import CubeMesh from "../Engine/Geometry/CubeMesh.js";
import Camera from "../Engine/Objects/Camera.js";
import Transform from "../Engine/Geometry/Transform.js";
import MeshLoader from "../Engine/Utils/MeshLoader.js";
import PointLight from "../Engine/Objects/PointLight.js";
import Scene from "../Engine/Objects/Scene.js";
import Terrain from "../Engine/Objects/Terrain.js";
import Texture from "../Engine/Shaders/Texture.js";
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
    const material1 = new Material("../Resources/Shaders/vertshader.vs.glsl", "../Resources/Shaders/fragshader.fs.glsl")
    const materialText = new Material("../Resources/Shaders/textured.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
    const terrainMat = new Material("../Resources/Shaders/terrain.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
    materials.push(material1, materialText, terrainMat)

    const pointLight = new PointLight(new Transform([3,0,3]), 2, [1,1,1])

    const scene = new Scene(gl, camera, pointLight, materials)

    scene.init().then(()=>{        
        setUpInputListeners(camera, canvas)
        const texture = new Texture("../Resources/Textures/Texture.jpg").load(gl)
        const terrain = new Terrain(10,10,1.5)
        let a = null
        scene.createEntity(terrain.getMesh(gl), terrainMat, new Transform([-5,-1,-5]), [1,1,1])
        //scene.createEntity(new CubeMesh(gl), materialText, new Transform([-2,0,2]), [0,0,1])
        scene.createEntity('../Resources/Models/croissant.obj', materialText, new Transform([0,1,0])).then(e=>a=e)
        //scene.createEntity('../Resources/Models/Tree02.obj', materialText, new Transform([5,-1,0]), [1,1,0])

        var animate = function(time) {
            //if(a)a.transform.rotate(0,1,0)
            scene.render()
            window.requestAnimationFrame(animate);
        }
        animate(0);
    })

    function setUpInputListeners(camera, canvas){
        document.addEventListener("keypress", function(event) {
            camera.keyPress(event)
        });
        
        canvas.onclick = function() {
            canvas.requestPointerLock();
        }
        document.addEventListener('pointerlockchange', ()=>{
            if(document.pointerLockElement === canvas) {
                document.addEventListener("mousemove", move, false);
            } else {
              document.removeEventListener("mousemove",move, false);
            }
        }, false);
             
        function move(e){
            camera.mouseMove(e)
        }
    }

}