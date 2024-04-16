#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;
in vec2 vTexCoord;
in float yPos;

// Uniforms
uniform vec3 lightPositions[8]; // max 8 different light sources
uniform vec4 lightColours[8];    
uniform vec3 cameraPosition;

uniform sampler2D u_texture;

out vec4 fragColour;

#define LOG2 1.442695


float grassUVs[3] = float[3](0.0,0.3, 0.45);

void main()
{

    float pct = 0.0;
    vec2 st = normalize(gl_FragCoord.xy);
    pct = distance(st,vec2(0.5));

    float ambientStrength = 0.05*yPos*yPos;
    float diffuseStrength = 0.8;    
    float specularStrength = 0.2;

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
    vec4 textColour = texture(u_texture, vec2(vTexCoord.x, vTexCoord.y));
    vec3 result = (ambient+diffuse) * textColour.xyz + specular*textColour.w;
    fragColour = vec4(result, textColour.w);

    if(textColour.w<0.75)discard;
 
}  