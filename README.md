# Custom 3D Game Engine

A simple 3D game/render engine built from scratch using WebGL 2.0. I decided to program this project from absolute scratch, using only gl-matrix library for matrix operations.

## Check it out here: [https://alextheprophecy.github.io/Game-Engine/](https://alextheprophecy.github.io/Game-Engine/)

![Screenshot 2024-12-02 021607](https://github.com/user-attachments/assets/cc634cfe-2bcf-4577-8233-2ace435ea995)
![image](https://github.com/user-attachments/assets/3479a975-57a2-48c8-a0fa-58d9c60a92fd)
![image](https://github.com/user-attachments/assets/9a5e9563-a0a8-414e-86c9-9e0c08c0a4fe)

---

## 🌟 Features

### Lighting & Effects
- **Blinn-Phong Lighting**:
  - Up to 8 concurrent light sources
  - Configurable light colors and intensities
  - Point lights and directional lights
- **Atmospherical Fog**:
  - Non-linear fog system with customizable density, falloff and colour

### Asset Management
- **Custom OBJ Loader**: 
  - Parsing and loading of .obj files
  - Support for vertex positions, normals, and UV coordinates
- **Custom Texture loader**
- **Custom Shader loader**

### Advanced Grass Renderer
- **Dynamic Grass Rendering**:
  - Instance-based rendering supporting 100,000+ grass blades
  - Player interaction with grass (position-based distortion)
  - Perlin noise-based animation for natural movement
  - Wind effect across grass plane
  - Procedural grass height and color variation using Perlin noise

### Camera & Controls
- **3rd Person Camera System**:
  - Using WASD and mouse movement/scroll
- **Wireframe mode**:
  - Show wireframe using LShift
