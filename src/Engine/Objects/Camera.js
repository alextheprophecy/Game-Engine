const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Camera {
    constructor(canvas){
        this.position = [0,3,10]
        this.target = [0, 0, 0]; // Camera target

        this.viewMatrix = mat4.create();
        
        this.recalculate()
        const fov = Math.PI / 3; // 45 degrees
        const aspectRatio = canvas.width / canvas.height; // Width divided by height
        const near = 0.1; // Near clipping plane
        const far = 100.0; // Far clipping plane

        this.projectionMatrix = mat4.create();
        mat4.perspective(this.projectionMatrix, fov, aspectRatio, near, far);             
    }

    recalculate(){
        const up = [0, 1, 0]; // Up vector
        //this.viewMatrix = [1,0,1,1]
        mat4.lookAt(this.viewMatrix, this.position, this.target, up);
    }

    keyPress(event){
        const rotSpeed = 0.5
        const x = this.position[0]
        const z = this.position[2]
        this.position[1] = 3
        if (event.key === "a") {                
            this.position[0] = x * Math.cos(rotSpeed) + z * Math.sin(rotSpeed);
            this.position[2] = z * Math.cos(rotSpeed) - x * Math.sin(rotSpeed);
        }else if (event.key === "d") {
            this.position[0] = x * Math.cos(rotSpeed) - z * Math.sin(rotSpeed);
            this.position[2] = z * Math.cos(rotSpeed) + x * Math.sin(rotSpeed);
        }
        this.recalculate()
    }

    mouseMove(event){
        if(!this.sumX){
            this.sumX = 0
            this.sumY = 0
        } 
        
        const dx = Math.sign(event.movementX ||
            event.mozMovementX          ||
            event.webkitMovementX       ||
            0)
        const dy = Math.sign(event.movementY ||
            event.mozMovementY      ||
            event.webkitMovementY   ||
            0)      

        const rotSpeed = 0.1
        const pi = 3.1
        this.sumX -= (dx *rotSpeed)%(2*pi)
        this.sumY = Math.min(Math.max(0,this.sumY+dy*rotSpeed),pi/2) //clamp sumy between 0 and 90 deg
        
        vec3.add(this.position, this.target,[10*Math.sin(this.sumX)*Math.cos(this.sumY),
            10*Math.sin(this.sumY),
            10*Math.cos(this.sumX)*Math.cos(this.sumY)
        ] )
     
        this.recalculate()
    }

    getMouseMovement(e){
        const movementX = e.movementX ||
            e.mozMovementX          ||
            e.webkitMovementX       ||
            0;
        const movementY = e.movementY ||
            e.mozMovementY      ||
            e.webkitMovementY   ||
            0;
        return [movementX,movementY]
    }
}

export default Camera