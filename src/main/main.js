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
import SkyBox from "../Engine/Objects/SkyBox.js";

const { mat4, mat3, vec2, vec3, vec4, quat} = glMatrix;

setup();  

function setup() {
    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2", {premultipliedAlpha:false});

    if (gl === null) return alert("Unable to initialize WebGL. Your browser or machine may not support it.");

    gl.clearColor(0.05,0,0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.depthFunc(gl.LEQUAL); // Near things obscure far things
    gl.enable(gl.DEPTH_TEST);

    gl.enable(gl.CULL_FACE); 

    main(gl, canvas);
}

function main(gl, canvas) {    
    const camera = new Camera(canvas)

    const pointLight = new PointLight(new Transform([0,6,0]), 50.0, [1,0.7,0.4])
    const dirLight = new PointLight(new Transform([2,-1,0]), -0.4, [0.6,0.7,0.4])
    const lights = [pointLight, dirLight]

    const sh1 = new Shader("../Resources/Shaders/vertshader.vs.glsl", "../Resources/Shaders/fragshader.fs.glsl")
    const shTextured = new Shader("../Resources/Shaders/textured.vs.glsl", "../Resources/Shaders/textured.fs.glsl")
    const shTerrain = new Shader("../Resources/Shaders/terrain.vs.glsl", "../Resources/Shaders/terrain.fs.glsl")
    const grassShader  = new Shader("../Resources/Shaders/grass.vs.glsl", "../Resources/Shaders/grass.fs.glsl")
    const skyBoxShader  = new Shader("../Resources/Shaders/skybox.vs.glsl", "../Resources/Shaders/skybox.fs.glsl")

    const shaders = [sh1, shTextured, shTerrain, grassShader, skyBoxShader]

    const scene = new Scene(gl, camera, lights, shaders)
    
    scene.init().then(()=>{
        setUpInputListeners(scene, canvas)

        //create textures and materials
        const textureP = new Texture("../Resources/Textures/palette.jpg").loadAsTexture(gl)
        const textureC = new Texture("../Resources/Textures/Texture.jpg").loadAsTexture(gl)
        const textureG = new Texture("../Resources/Textures/grassTex.png").loadAsTexture(gl)
        const textureSkyBox = new Texture("../Resources/Textures/CubeMaps/third/").loadAsCubeMap(gl, "bmp")

        const terrainMat = new Material(shTerrain, [0.1,0.25,0], null)
        const croissantMat = new Material(shTextured, [1,1,1], textureC, [0.2, 0.8, 1])
        const treeMat = new Material(shTextured, [1,1,1], textureP, [0.05, 0.3, 0.1])
        const grassMat = new Material(grassShader, [1,1,1], textureG)
        const skyBoxMat = new Material(skyBoxShader, [1,1,1])
        
        //add entitites to the scene
        const skyBox = new SkyBox()
        skyBox.init(gl, skyBoxMat, textureSkyBox)

        const terrain = new Terrain(50,50,1)
        scene.createEntity(terrain.getMesh(gl), terrainMat, new Transform([-25,0,-25]))

        const grass = new GrassArea(gl, grassMat, new Transform([-25,0,-25]), 50, 50, 12)

        let croissant = null
        scene.createEntity('../Resources/Models/croissant.obj', croissantMat,  new Transform([0,2,0])).then(e=>{
            camera.setFocus(e, [0,2,0])
            croissant=e
        })

        scene.createEntity('../Resources/Models/Tree02.obj', treeMat, new Transform([15,0,-5]))
        
        let then = 0;

        //main loop
        var loop = function(time) {
            gl.clear(gl.COLOR_BUFFER_BIT);

            //if(croissant)characterLight.transform.follow(croissant.transform, [0,2,5])
            pointLight.transform.translate(0.2*Math.sin(time*0.002), 0, 0.2*Math.cos(time*0.002))
            scene.render()
            if(croissant)grass.render(time, camera, lights, croissant.transform.position)
            skyBox.render(camera)
        

            /*time *= 0.001;                          // convert to seconds
            const deltaTime = time - then;          // compute time since last frame
            then = time;                            // remember time for next frame
            const fps = 1 / deltaTime;   
            //console.log(fps) */
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