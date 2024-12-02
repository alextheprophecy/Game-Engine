#version 300 es
precision highp float;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 transformationMatrix;
uniform float time;
uniform vec3 playerPosition;

in vec3 position;
in mat4 m_transform;
in vec3 normal; 
in vec2 uv0;
in float instanceId;

out vec3 vNormal;
out vec3 vPosition;
out vec2 vTexCoord;
out float yPos;
out float gScale;
out vec3 vColour;
#define e 2.71828
#define PI 3.1415

mat3 rotateXNScale(float theta, float scaleY) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(
        vec3(1.0, 0, 0),
        vec3(0, scaleY*c, -s),
        vec3(0, s, c)
    );
}
//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/stegu/webgl-noise
//

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
  Pi = mod289(Pi);        // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}



void main() {   
    float rotationFactor = 0.05;

    yPos = position.y;
    vTexCoord = uv0;
    
    vec4 bladePos = transformationMatrix*m_transform*vec4(0,0,0,1);
    float scale = abs(instanceId)*1.75 + 0.5;

    //wind
    vec2 windDir = vec2(1,1);

    float windStrength = 0.65;
    float windSpeed = 0.4;
    float windWidth = 0.05;
    float n = windStrength*pnoise(bladePos.xz*windWidth + windDir*time*windSpeed, vec2(5,5));
    float backGround = 0.3*pnoise(bladePos.zx*0.15 + windDir*time*windSpeed, vec2(5,5));
    mat3 newWind = rotateXNScale(n+backGround, scale);

    //player interactive  
    float playerPushForce = 1.8;    
    float maxDistanceFromPlayer =5.0*scale;

    vec3 playerOffset;
    float distToPlayer = distance(playerPosition, bladePos.xyz)*0.3;
    if(distToPlayer<=maxDistanceFromPlayer){        
        vec3 dir = -normalize(playerPosition-bladePos.xyz);
        dir.y = 0.0; 
        playerOffset = scale* dir * playerPushForce*(position.y*position.y+0.9) / (pow(e,distToPlayer*distToPlayer*3.0));
    }


    vec4 worldPosition = transformationMatrix*m_transform*vec4(newWind *position, 1.0) + vec4(playerOffset, 0.0);
    vPosition = worldPosition.xyz; 
    vNormal = (transpose(inverse(transformationMatrix*m_transform))*vec4(newWind*normal,1.0)).xyz;

    gScale = abs(instanceId);
    gl_Position = projectionMatrix*modelViewMatrix*worldPosition;

    
    vColour = vec3( 0.5 + 0.5*vec3(n));
}

