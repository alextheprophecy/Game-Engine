attribute vec3 a_position;

void main() {
    // Multiply the vertex position by the model-view and projection matrices
    gl_Position =vec4(a_position.x, a_position.y, a_position.z, 1.0);
}