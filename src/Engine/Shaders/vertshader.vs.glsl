attribute vec3 a_position;

// This matrix will be used to transform the vertices
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;

void main() {
    // Multiply the vertex position by the model-view and projection matrices
    gl_Position =vec4(a_position.x, a_position.y, a_position.z, 1.0);
}