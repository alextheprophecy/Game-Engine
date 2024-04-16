#version 300 es
precision highp float;
 
uniform samplerCube u_skybox;
uniform mat4 u_viewDirectionProjectionInverse;
 
in vec4 vPosition;

out vec4 fragColour;

void main() {
  vec4 t = u_viewDirectionProjectionInverse * vPosition;
  fragColour = texture(u_skybox, normalize(t.xyz / t.w));
}