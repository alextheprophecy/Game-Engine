#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vColour;
in vec3 vNormal;

// Uniforms
uniform vec3 lightPosition; // Position of the point light
uniform vec3 lightColour; // Color of the point light
uniform vec3 cameraPosition;

uniform vec4 u_fogColour;
uniform float u_fogDensity;
uniform float u_fogStart;


out vec4 fragColour;

#define LOG2 1.442695


void main()
{
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * lightColour;

    
    float diffuseStrength = 2.0;
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);  
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diffuseStrength * diff * lightColour;


    float specularStrength = 1.7;
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(norm, halfwayDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColour;   
    

    vec3 result = (ambient+diffuse) * vColour;
    vec4 tfragColour = vec4(result, 1);

    float fogDistance = length(vPosition);
    float linearFog = smoothstep(u_fogStart, u_fogStart+5.0, fogDistance);
    float fogAmount = 1.0 - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.0);

    fragColour = tfragColour;// mix(tfragColour, u_fogColour, fogAmount*linearFog);  
}  