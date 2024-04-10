#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;
uniform vec3 objectColour;

in vec3 position;

out vec3 vColour;
out vec3 vPosition;

void main() {
    vColour = objectColour;

    vec4 worldPosition = modelViewMatrix*transformationMatrix * vec4(position, 1.0);
    vPosition = worldPosition.xyz; 
    
    gl_Position = projectionMatrix*worldPosition;
}