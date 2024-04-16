#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;
uniform float time;

in vec3 position;
in mat4 m_transform;
in vec3 normal; 
in vec2 uv0;
in float instanceId;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vTexCoord;
out float yPos;

mat3 rotateXNScale(float theta, float scaleY) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1.0, 0, 0),
        vec3(0, scaleY*c, -s),
        vec3(0, s, c)
    );
}

void main() {
    yPos = position.y;

    float scale = abs(instanceId)*3.0+ 0.7;
    
    vTexCoord = uv0;
    vNormal = (transpose(inverse(transformationMatrix*m_transform))*vec4(normal,1.0)).xyz;

    float rotationFactor = 0.05;
    mat3 windMovement = rotateXNScale((0.25 + sin(time * abs(instanceId)*3.0))*rotationFactor*position.y*position.y, scale);
    
    vec4 worldPosition = transformationMatrix*m_transform*vec4(windMovement*position,1.0);
    vPosition = worldPosition.xyz; 

   

    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;
}

