import Material from "../Engine/Shaders/Material.js";
import Camera from "../Engine/Objects/Camera.js";
import Transform from "../Engine/Geometry/Transform.js";
import MeshLoader from "../Engine/Utils/MeshLoader.js";
import PointLight from "../Engine/Objects/PointLight.js";
import Scene from "../Engine/Objects/Scene.js";
import Terrain from "../Engine/Objects/Terrain.js";
import Texture from "../Engine/Shaders/Texture.js";
import Shader from "../Engine/Shaders/Shader.js";

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

    const pointLight = new PointLight(new Transform([0,3,0]), 2, [1,0,0])
    const pointLight2 = new PointLight(new Transform([-5,0,5]), 2, [0,1,0.5])
    const lights = [pointLight, pointLight2]

    const sh1 = new Shader("../Resources/Shaders/vertshader.vs.glsl", "../Resources/Shaders/fragshader.fs.glsl")
    const shTextured = new Shader("../Resources/Shaders/textured.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
    const shTerrain = new Shader("../Resources/Shaders/terrain.vs.glsl", "../Resources/Shaders/terrain.fs.glsl")
    const shaders = [sh1, shTextured, shTerrain]


    const scene = new Scene(gl, camera, lights, shaders)

    scene.init().then(()=>{        
        setUpInputListeners(camera, canvas)

        const textureP = new Texture("../Resources/Textures/Texture.jpg").load(gl)
        const terrainMat = new Material(shTerrain)
        const texturedMat = new Material(shTextured)
        
        const terrain = new Terrain(200,200,1)
        scene.createEntity(terrain.getMesh(gl), terrainMat, new Transform([-50,-2,-50]), [1,1,1])

        let croissant = null
        scene.createEntity('../Resources/Models/croissant.obj', texturedMat,  new Transform([0,0,0])).then(e=>{
            camera.setFocus(e)
            croissant=e
        })
        //scene.createEntity('../Resources/Models/Tree02.obj', texturedMat, new Transform([5,-2,0]))
        
        var animate = function(time) {
            pointLight.transform.translate(0.2*Math.sin(time*0.002), 0, 0.2*Math.cos(time*0.002))
            scene.render()
            window.requestAnimationFrame(animate);
        }
        animate(0);
    })

    function setUpInputListeners(camera, canvas){
        document.addEventListener("keydown", function(event) {
            camera.keyPress(event)
        });
        
        canvas.onclick = function() {
            canvas.requestPointerLock();
        }
        document.addEventListener('pointerlockchange', ()=>{
            if(document.pointerLockElement === canvas) {
                document.addEventListener("mousemove", move, false);
                document.addEventListener("wheel", scroll, false);
                
            } else {
                document.removeEventListener("mousemove",move, false);
                document.removeEventListener("wheel",scroll, false);
            }
        }, false);
             
        function move(e){
            camera.mouseMove(e)
        }
        function scroll(e){
            camera.scroll(e)
        }
    }

}