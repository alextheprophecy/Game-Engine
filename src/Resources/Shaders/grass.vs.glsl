#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;

in vec3 colour;
in vec3 offset;
in vec3 position;
in mat4 m_transform;
in vec3 normal; 



out vec3 vNormal;
out vec3 vPosition;
out vec3 vColour;

void main() {
    vColour =colour;

    vNormal = (transpose(inverse(transformationMatrix))*vec4(normal,1.0)).xyz;

    vec4 worldPosition = transformationMatrix*m_transform*vec4(position, 1.0);
    vPosition = worldPosition.xzy; 
    
    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;
}