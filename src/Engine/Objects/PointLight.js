class PointLight{
    constructor(transform, brightness, colour=[1,1,1]){
        this.transform = transform
        this.brightness = brightness
        this.colour = colour
    }
}

export default PointLight