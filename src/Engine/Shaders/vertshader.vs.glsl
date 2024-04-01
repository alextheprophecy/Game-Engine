#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

in vec3 position;
in vec3 normal; // New input for vertex normal
in vec3 colour;

out vec3 vColour;
out vec3 vNormal;
out vec3 vPosition;

void main() {
    vColour = colour;
    vNormal = normal;

    vec4 worldPosition = transformationMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz;   
    
    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;
}