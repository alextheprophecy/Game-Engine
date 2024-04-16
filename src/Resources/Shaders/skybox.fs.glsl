#version 300 es
precision highp float;
 
uniform samplerCube skybox;
uniform mat4 viewDirectionProjectionInverse;

in vec4 vPosition;

out vec4 fragColour;

void main() {
  vec4 t = viewDirectionProjectionInverse*vPosition;
  fragColour = texture(skybox, normalize(t.xyz / t.w));
}