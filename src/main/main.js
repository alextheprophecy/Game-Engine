import Material from "../Engine/Shaders/Material.js";
import Camera from "../Engine/Objects/Camera.js";
import Transform from "../Engine/Geometry/Transform.js";
import MeshLoader from "../Engine/Utils/MeshLoader.js";
import PointLight from "../Engine/Objects/PointLight.js";
import Scene from "../Engine/Objects/Scene.js";
import Terrain from "../Engine/Objects/Terrain.js";
import Texture from "../Engine/Shaders/Texture.js";
import Shader from "../Engine/Shaders/Shader.js";
import GrassArea from "../Engine/Objects/GrassArea.js";

const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.05,0,0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    main(gl, canvas);
}

function main(gl, canvas) {    
    const camera = new Camera(canvas)

    const pointLight = new PointLight(new Transform([0,6,0]), 50.0, [1,0.7,0.4])
    const pointLight2 = new PointLight(new Transform([-5,10,5]), 100)
    const characterLight = new PointLight(new Transform([-10,2,0]),10, [0,0,1])
    const lights = [pointLight, pointLight2,characterLight]

    const sh1 = new Shader("../Resources/Shaders/vertshader.vs.glsl", "../Resources/Shaders/fragshader.fs.glsl")
    const shTextured = new Shader("../Resources/Shaders/textured.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
    const shTerrain = new Shader("../Resources/Shaders/terrain.vs.glsl", "../Resources/Shaders/terrain.fs.glsl")
    const grassShader  = new Shader("../Resources/Shaders/grass.vs.glsl", "../Resources/Shaders/grass.fs.glsl")

    const shaders = [sh1, shTextured, shTerrain, grassShader]

    const scene = new Scene(gl, camera, lights, shaders)

    scene.init().then(()=>{        
        setUpInputListeners(scene, canvas)

        //create textures and materials
        const textureP = new Texture("../Resources/Textures/palette.jpg").load(gl)
        const textureC = new Texture("../Resources/Textures/Texture.jpg").load(gl)

        const terrainMat = new Material(shTerrain)
        const croissantMat = new Material(shTextured, [1,1,1], textureC)
        const treeMat = new Material(shTextured, [1,1,1], textureP)
        const grassMat = new Material(grassShader, [1,1,1])

        //add entitites to the scene
        const terrain = new Terrain(200,200,1)
        scene.createEntity(terrain.getMesh(gl), terrainMat, new Transform([-50,-2,-50]), [1,1,1])

        const grass = new GrassArea(gl, grassMat, new Transform([-3,-2,3]), 20, 20, 2)

        let croissant = null
        scene.createEntity('../Resources/Models/croissant.obj', croissantMat,  new Transform([0,0,0], [0,0,0])).then(e=>{
            camera.setFocus(e)
            croissant=e
        })
        scene.createEntity('../Resources/Models/Tree02.obj', treeMat, new Transform([8,-2,-5]))
        
        //main loop
        var loop = function(time) {
            if(croissant)characterLight.transform.follow(croissant.transform, [0,1,5])
            pointLight.transform.translate(0.2*Math.sin(time*0.002), 0, 0.2*Math.cos(time*0.002))

            scene.render()
            grass.render(camera, lights)

            window.requestAnimationFrame(loop);
        }
        loop(0);
    })

    function setUpInputListeners(scene, canvas){
        document.addEventListener("keydown", function(event) {
            scene.camera.keyPress(event)
            scene.keyPress(event)
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
            scene.camera.mouseMove(e)
        }
        function scroll(e){
            scene.camera.scroll(e)
        }
    }

}