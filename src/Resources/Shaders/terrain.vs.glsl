#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;
uniform vec3 objectColour;

in vec3 position;
in vec3 normal; // New input for vertex normal
in vec2 uv0;

out vec3 vColour;
out vec3 vNormal;
out vec3 vPosition;
out vec2 vTexCoord;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

vec3 height(vec2 coords) {
    return vec3(coords.x, abs(noise(coords)),coords.y);
}
float delta = 0.1;



void main() {
    //vColour = objectColour;
    vec3 top =  height(vec2(position.x, position.z-delta))-height(position.xz);
    vec3 bottom =  height(vec2(position.x, position.z+delta))-height(position.xz);
    vec3 left =  height(vec2(position.x-delta, position.z))-height(position.xz);
    vec3 right =  height(vec2(position.x+delta, position.z))-height(position.xz);


    vec3 cNormal = normalize(cross(top,left)+cross(left,bottom)+cross(bottom,right)+cross(right,top));
    vNormal = vec3(0,1,0);//(transpose(inverse(transformationMatrix))*vec4(cNormal,0.0)).xyz;
    vColour = objectColour;
    vTexCoord = uv0;

    vec4 worldPosition = transformationMatrix * vec4(height(position.xz), 1.0);
    vPosition = worldPosition.xyz; 
    
    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;//+ vec4(height(position.xz),0);
}