#version 300 es
precision highp float;

in vec3 vColour;
out vec4 fragColour;

void main()
{
    fragColour = vec4(vColour,1.0);
}  