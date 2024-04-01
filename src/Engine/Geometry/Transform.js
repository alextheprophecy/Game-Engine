const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Transform{
    constructor(position=null, rotation=null) {
        this.position=position?position:vec3.create()
        this.rotation=rotation?rotation:vec3.create()
    }

    rotate(x,y,z){
        this.rotation[0]+=x
        this.rotation[1]+=y
        this.rotation[2]+=z
    }

    translate(x,y,z){
        this.position[0]+=x
        this.position[1]+=y
        this.position[2]+=z
    }

    transformationMatrix(){
        const out = mat4.create()        
        const q = quat.create()
        quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
        mat4.fromQuat(out, q);
        mat4.translate(out, out, this.position);
        return out
    }
}

export default Transform