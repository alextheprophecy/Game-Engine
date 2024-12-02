#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;
in float yPos;
in float gScale;
in vec3 vColour;
// Uniforms
uniform vec3 lightPositions[8]; // max 8 different light sources
uniform vec4 lightColours[8];    
uniform vec3 cameraPosition;

uniform sampler2D u_texture;

uniform vec4 u_fogColour;
uniform float u_fogDensity;
uniform float u_fogStart;


out vec4 fragColour;

#define LOG2 1.442695


float grassUVs[3] = float[3](0.0,0.3, 0.45);
int grassIndex = 0;

void main()
{
    float ambientStrength = 0.07*yPos*yPos;
    float diffuseStrength = 0.8;    
    float specularStrength = 0.45;

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
    vec3 res = mix(vec3(0.898, 0.5961, 0.0745), vec3(0.1961, 0.9451, 0.1961),gScale);
    //sample texture colour
    vec4 textColour = texture(u_texture, vec2(vTexCoord.x+grassUVs[grassIndex], vTexCoord.y));
    vec3 result = (ambient+diffuse) * textColour.xyz * res+ specular;

    //calculate fog
    float dist = distance(cameraPosition, vPosition);
    float fogAmount = 0.0;
    if(dist>=u_fogStart){
        float fogDistance = length(vPosition-cameraPosition);
        float linearFog = smoothstep(u_fogStart, u_fogStart+5.0, fogDistance);
        fogAmount = 1.0 - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * LOG2);
        fogAmount = clamp(fogAmount, 0., 1.)*linearFog;
    }

    fragColour = mix(vec4(result, textColour.w), u_fogColour, fogAmount);  

    if(textColour.w<0.75)discard;
 
}  