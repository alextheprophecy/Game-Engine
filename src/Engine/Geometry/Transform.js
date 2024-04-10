const { mat4, mat3, vec2, vec3, vec4, quat } = glMatrix;

class Transform{
    constructor(position=vec3.create(), rotation=vec3.create()) {
        this.position=position
        this.rotation=rotation
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

    forward(){
        const f = vec3.create()
        vec3.rotateY(f, [0,0,1],[0,0,0], glMatrix.glMatrix.toRadian(this.rotation[1]))
        return vec3.normalize(f, f)
    }

    transformationMatrix(){
        const out = mat4.create()        
        const q = quat.create() 
        //mat4.translate(out, out, this.position);
        quat.fromEuler(q, this.rotation[0], this.rotation[1], this.rotation[2]);
        mat4.fromRotationTranslation(out, q, this.position)
        return out
    }
}

export default Transform