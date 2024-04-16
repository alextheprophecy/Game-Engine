#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;
uniform float time;
uniform vec3 playerPosition;

in vec3 position;
in mat4 m_transform;
in vec3 normal; 
in vec2 uv0;
in float instanceId;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vTexCoord;
out float yPos;
out vec3 vColour;

#define e 2.71828

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
    float rotationFactor = 0.05;
    


    yPos = position.y;
    vTexCoord = uv0;
    vNormal = (transpose(inverse(transformationMatrix*m_transform))*vec4(normal,1.0)).xyz;
    
    vec4 bladePos = transformationMatrix*m_transform*vec4(0,0,0,1);

    float scale = abs(instanceId)*3.0+ 0.7;
    mat3 windMovement = rotateXNScale((0.15 + sin(time * abs(instanceId)*3.0))*rotationFactor*position.y*position.y, scale);
    
    //player interactive  
    float playerPushForce = 2.1;    
    float maxDistanceFromPlayer =5.0*scale;

    vec3 playerOffset;
    float distToPlayer = distance(playerPosition, bladePos.xyz)*0.3;
    if(distToPlayer<=maxDistanceFromPlayer){        
        vec3 dir = -normalize(playerPosition-bladePos.xyz);
        dir.y = 0.0; 
        playerOffset = scale* dir * playerPushForce*(position.y*position.y+0.9) / (pow(e,distToPlayer*distToPlayer*3.0));
    }


    vec4 worldPosition = transformationMatrix*m_transform*vec4(windMovement*position, 1.0) + vec4(playerOffset, 0.0);
    vPosition = worldPosition.xyz; 


    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;
}

