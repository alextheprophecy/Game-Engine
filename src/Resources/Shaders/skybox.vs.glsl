#version 300 es
precision highp float;

in vec4 position;
out vec4 vPosition;

void main() {
  vec4 offset = vec4(0.0,0.2,0.0, 0.0);
  vPosition = position + offset;
  gl_Position = position;
  gl_Position.z = 1.0;
}