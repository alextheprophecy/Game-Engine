#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

in vec3 position;
in vec3 normal; // New input for vertex normal
in vec2 uv0;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vTexCoord;

void main() {
    vNormal = (transpose(inverse(transformationMatrix))*vec4(normal,1.0)).xyz;
    vTexCoord = uv0;

    vec4 worldPosition = transformationMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz; 
    
    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;
}