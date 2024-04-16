const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Camera {
    constructor(canvas){
        this.focusEntity = null
        this.position = [0,3,10]
        this.target = [0, 0, 0]// Camera target
        this.distance = 10

        this.projectionMatrix = mat4.create();
        this.viewMatrix = mat4.create();  

        const FOV = Math.PI / 3; // 45 degrees
        const ASPECT_R = canvas.width / canvas.height; // Width divided by height
        const NEAR_CLIP = 0.1; // Near clipping plane
        const FAR_CLIP = 100.0; // Far clipping plane

        mat4.perspective(this.projectionMatrix, FOV, ASPECT_R, NEAR_CLIP, FAR_CLIP);              
        this.recalculate()                    
    }

    recalculate(){
        if(!this.sumX){
            this.sumX = 0
            this.sumY = 0
        } 
        vec3.add(this.position, this.target,[this.distance*Math.sin(this.sumX)*Math.cos(this.sumY),
            Math.max(-2, this.distance* Math.sin(this.sumY)),
            this.distance*Math.cos(this.sumX)*Math.cos(this.sumY)
        ] )

        const up = [0, 1, 0]; // Up vector
        mat4.lookAt(this.viewMatrix, this.position, this.target, up);
    }

    getViewDirProjInvMat(){
        const viewMatrix = mat4.clone(this.viewMatrix)
        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;
        mat4.multiply(viewMatrix, this.projectionMatrix, viewMatrix);
        mat4.invert(viewMatrix, viewMatrix)
        return viewMatrix
    }

    keyPress(event){
        if(!this.focusEntity)return
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
        vec3.add(this.target, this.focusEntity.transform.position, this.focusOffset)
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
        this.sumY = Math.min(Math.max(-0.3,this.sumY+dy*rotSpeed),pi/2) //clamp sumy between 0 and 90 deg        
        this.recalculate()
    }

    scroll(event){
        const delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

        this.distance=Math.max(2,Math.min(50,this.distance-delta))

        vec3.add(this.position, this.target, [this.distance*Math.sin(this.sumX)*Math.cos(this.sumY),
            this.distance* Math.sin(this.sumY),
            this.distance*Math.cos(this.sumX)*Math.cos(this.sumY)
        ] )
        this.recalculate()
    }

    setFocus(entity, offset){
        this.focusOffset = offset
        this.focusEntity = entity
        vec3.add(this.target, this.focusEntity.transform.position, this.focusOffset)
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