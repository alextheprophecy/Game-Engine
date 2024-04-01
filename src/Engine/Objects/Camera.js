const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Camera {
    constructor(canvas){
        this.position = [0,2,7]
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
        mat4.lookAt(this.viewMatrix, this.position, this.target, up);
    }
}

export default Camera