#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vColour; // Interpolated vertex color
in vec3 vNormal; // Interpolated vertex normal

// Uniforms
uniform vec3 lightPosition; // Position of the point light
uniform vec3 lightColour; // Color of the point light
uniform vec3 cameraPosition;

out vec4 fragColour;

void main()
{
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColour;

    

    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(lightPosition - vPosition);  
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = diff * lightColour;

    float specularStrength = 0.8;
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColour;   

    vec3 result = (ambient+diffuse+specular) * vColour;
    fragColour = vec4(result, 1);
}  