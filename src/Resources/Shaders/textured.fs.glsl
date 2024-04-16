#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;

// Uniforms
uniform vec3 lightPositions[8]; // max 8 different light sources
uniform vec4 lightColours[8];    
uniform vec3 cameraPosition;

uniform vec3 materialProperties; //ambient, diffuse, specular

uniform vec4 u_fogColour;
uniform float u_fogDensity;
uniform float u_fogStart;

uniform sampler2D u_texture;

out vec4 fragColour;

#define LOG2 1.442695



void main()
{

    float ambientStrength = materialProperties.x;
    float diffuseStrength = materialProperties.y;
    float specularStrength = materialProperties.z;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);

    //calculate lighting for each light
    for(int i = 0; i < 8; i++) {
        float lightRadius = lightColours[i].w;
        vec3 lightDir;
        float att;
        if(lightRadius>0.){ //Point Light
            float lightDist = distance(lightPositions[i], vPosition);
            att = 1.0 / (1.0 + 0.1*lightDist + 1.0/(lightRadius*lightRadius)*lightDist*lightDist);
            lightDir = normalize(lightPositions[i] - vPosition);  
        }else{ //Directional Light
            att = abs(lightRadius);
            lightDir = -lightPositions[i];
        }

        

        ambient += ambientStrength*lightColours[i].xyz;        

        float diff = max(dot(norm, lightDir), 0.0);
        diffuse += att * diffuseStrength * diff * lightColours[i].xyz;

        vec3 halfwayDir = normalize(lightDir + viewDir);  
        float spec = pow(max(dot(norm, halfwayDir), 0.0), 32.0);
        specular += att * specularStrength* spec * lightColours[i].xyz;   
    }

    //sample texture colour
    vec3 textColour = texture(u_texture, vTexCoord).xyz;
    vec3 result = (ambient+diffuse) * textColour + specular;
    vec4 tfragColour = vec4(result, 1);

    //calculate fog
    float fogDistance = length(vPosition-cameraPosition);
    float linearFog = smoothstep(u_fogStart, u_fogStart+5.0, fogDistance);
    float fogAmount = 1.0 - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
    fogAmount = clamp(fogAmount, 0., 1.);

    fragColour = mix(tfragColour, u_fogColour, fogAmount*linearFog);  
}  