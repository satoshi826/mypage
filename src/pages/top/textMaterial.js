import * as THREE from 'three'

const material = new THREE.MeshStandardMaterial({
  metalness: 0.8,
  roughness: 0.6,
  color    : '#aaa',
})


export default function textMaterial () {

  material.onBeforeCompile = (shader) => {

    shader.uniforms.u_time = {value: 0}
    shader.uniforms.u_sizeW = {value: 0}

    // define
    shader.vertexShader = vertexShaderDefine + shader.vertexShader
    shader.vertexShader = shader.vertexShader.replace('#include <beginnormal_vertex>', beginnormal_vertex)
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', begin_vertex)
    material.userData.shader = shader
  }

  return material
}

const vertexShaderDefine = `
uniform float u_time;
uniform float u_sizeW;
varying vec2 v_uv;
`

const beginnormal_vertex = `
float delta = 1.0 - u_time;
vec3 objectNormal =  normal;
`

const begin_vertex = `
v_uv = uv;
float rx = position.x - u_sizeW;
float rz = position.z - 2.5;
float r = sqrt(pow(rx, 2.0)+pow(rz, 2.0));

float flagOver180 = 2.0 * step(0.0, rx) - 1.0;
float theta = atan(rz/rx) + r/2.0 * (1.0 - delta);
float cosT = flagOver180 * cos(theta);
float sinT = flagOver180 * sin(theta);

r = r * delta;
vec3 transformed = vec3(r*cosT + u_sizeW, position.y * delta, r*sinT);
`
