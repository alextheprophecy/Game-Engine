#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vColour;
in vec3 vNormal;

// Uniforms
uniform vec3 lightPositions; // Position of the point light
uniform vec3 lightColour; // Color of the point light
uniform vec3 cameraPosition;

out vec4 fragColour;

void main()
{
    float ambientStrength = 0.2;
    vec3 ambient = ambientStrength * lightColour;
    
    float diffuseStrength = 0.8;
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(lightPositions);  
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diffuseStrength * diff * lightColour;

    float specularStrength = 0.7;
    vec3 viewDir = normalize(cameraPosition - vPosition);
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(norm, halfwayDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColour;   

    vec3 result = (ambient+diffuse) * vColour;// + specular;

    fragColour = vec4(vColour,1);//vec4(result,1);//vec4(result, 1);
}  