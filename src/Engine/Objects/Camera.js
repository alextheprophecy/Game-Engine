const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Camera {
    constructor(canvas){
        this.position = [0,3,10]
        this.target = [0, 2, 0]; // Camera target

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

    move(event){
        const rotSpeed = 0.05
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
}

export default Camera