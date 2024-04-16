import Mesh from "../Geometry/Mesh"

class SkyBox extends Mesh{

    constructor(){
        super()
    }


    init(gl){
        const positions2d =[-1, -1, 1, -1, -1,  1, -1,  1, 1, -1, 1,  1]
        this.bufferData(gl, positions2d, 2, "positions")
    }
}

export default SkyBox