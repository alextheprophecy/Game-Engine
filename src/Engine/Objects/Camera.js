const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Camera {
    constructor(canvas){
        this.focusEntity = null
        this.position = [0,3,10]
        this.target = [0, 0, 0]// Camera target
        this.distance = 10
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
        if(!this.sumX){
            this.sumX = 0
            this.sumY = 0
        } 
        vec3.add(this.position, this.target,[this.distance*Math.sin(this.sumX)*Math.cos(this.sumY),
            this.distance* Math.sin(this.sumY),
            this.distance*Math.cos(this.sumX)*Math.cos(this.sumY)
        ] )

        const up = [0, 1, 0]; // Up vector
        //this.viewMatrix = [1,0,1,1]
        mat4.lookAt(this.viewMatrix, this.position, this.target, up);
    }

    keyPress(event){
        if(!this.focusEntity)return
        
        this.target = this.focusEntity.transform.position;
        const rotateSpeed = 7
        if (event.key === "a") {  
            //const f = this.focusEntity.transform.right()              
            //this.focusEntity.transform.translate(-f[0], -f[1], -f[2]);
            this.focusEntity.transform.rotate(0,rotateSpeed,0);
        }else if (event.key === "d") {
            //const f = this.focusEntity.transform.right()
            //this.focusEntity.transform.translate(f[0], f[1], f[2]);
            this.focusEntity.transform.rotate(0,-rotateSpeed,0);
        }
        
        if (event.key === "w") {
            const f = this.focusEntity.transform.forward()
            this.focusEntity.transform.translate(f[0], f[1], f[2]);
        }else if (event.key === "s") {
            const f = this.focusEntity.transform.forward()
            this.focusEntity.transform.translate(-f[0], -f[1], -f[2]);

        }
        this.recalculate()
    }

    mouseMove(event){  
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
     
        this.recalculate()
    }

    scroll(event){
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        this.distance=Math.max(2,Math.min(50,this.distance-delta))

        vec3.add(this.position, this.target,[this.distance*Math.sin(this.sumX)*Math.cos(this.sumY),
            this.distance* Math.sin(this.sumY),
            this.distance*Math.cos(this.sumX)*Math.cos(this.sumY)
        ] )
        this.recalculate()
    }

    setFocus(entity){
        this.focusEntity = entity
    }

    updatePo
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