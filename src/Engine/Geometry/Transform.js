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

    translateAlong(x,y,z,forwardDir,rightDir,upDir=[0,1,0]){
        
    }
    
    follow(transformOther, positionOffset, rotationOffset = null){
        const f = transformOther.forward()
        const r = transformOther.right()
        const offset = [f[0]*positionOffset[2] + r[0]*positionOffset[0],
            positionOffset[1], f[2]*positionOffset[2] + r[2]*positionOffset[0]]          
        vec3.add(this.position, transformOther.position, offset)      
        if(rotationOffset)vec3.add(this.rotation, transformOther.rotation, rotationOffset)  
    }

    forward(){
        const f = vec3.create()
        vec3.rotateY(f, [0,0,1], [0,0,0], glMatrix.glMatrix.toRadian(this.rotation[1]))
        vec3.rotateX(f, f, [0,0,0], glMatrix.glMatrix.toRadian(this.rotation[0]))
        vec3.rotateZ(f, f, [0,0,0], glMatrix.glMatrix.toRadian(this.rotation[2]))
        return vec3.normalize(f, f)
    }

    right(){
        const f = vec3.create()
        vec3.rotateY(f, [-1,0,0], [0,0,0], glMatrix.glMatrix.toRadian(this.rotation[1]))
        vec3.rotateZ(f, f, [0,0,0], glMatrix.glMatrix.toRadian(this.rotation[2]))
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