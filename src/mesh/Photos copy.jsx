import * as THREE from 'three'
import {useRef, useEffect} from 'react'

const tempBoxes = new THREE.Object3D()
const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/square-outline-textured.png')
const texture2 = new THREE.TextureLoader().load('https://threejs.org/examples/textures/roughness_map.jpg')

const i = 2
const j = 1

const IdList = new Array(i * j).fill().map((_, id) => id)
const textureIndex = new Float32Array(IdList)
console.log(textureIndex)

const setTexture = (shader) => {

  shader.uniforms.textures = {
    type : 'tv',
    value: [
      texture,
      texture2
    ]
  }

  shader.vertexShader = shader.vertexShader
    .replace(
      '#define STANDARD',
      `#define STANDARD
    varying vec3 vTint;
    varying float vTextureIndex;`
    ).replace(
      '#include <common>',
      `#include <common>
    attribute vec3 tint;
    attribute float textureIndex;`
    ).replace(
      '#include <project_vertex>',
      `#include <project_vertex>
    vTint = tint;
    vTextureIndex=textureIndex;`
    )

  // shader.fragmentShader = shader.fragmentShader
  //   .replace(
  //     '#define STANDARD',
  //     `#define STANDARD
  //   uniform sampler2D textures[2];
  //   varying vec3 vTint;
  //   varying float vTextureIndex;`
  //   )
  //   .replace(
  //     '#include <fog_fragment>',
  //     `#include <fog_fragment>
  //       float x = vTextureIndex;
  //       vec4 col;
  //       col = texture2D(textures[0], vUv );
  //       //col = texture2D(textures[0], vUv ) * step(-0.1, x) * step(x, 0.1);
  //       //col += texture2D(textures[1], vUv ) * step(0.9, x) * step(x, 1.1);
  //       gl_FragColor = col;
  //     `
  //   )

}



export default function Photos () {

  const ref = useRef()

  useEffect(() => {
    let counter = 0
    for (let y = 0; y < j; y++) {
      for (let x = 0; x < i; x++) {
        const id = counter++
        tempBoxes.position.set(...calcPosition(x, i, y))
        tempBoxes.rotation.y = calcRotation(x, i)
        tempBoxes.updateMatrix()
        ref.current.setMatrixAt(id, tempBoxes.matrix)
      }
    }

    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={ref}
      args={[null, null, i * j]}>
      <planeBufferGeometry args={[18, 12]} >
        <instancedBufferAttribute attach='textureIndex' args={[textureIndex, 1]} />
      </planeBufferGeometry>
      <meshStandardMaterial onBeforeCompile={setTexture}/>
    </instancedMesh>
  )
}


function calcPosition(index, photoListLength, j) {
  const r = 40
  const unitAngle = 2 * Math.PI / photoListLength
  return(
    [
      r * Math.cos(index * unitAngle),
      15 * (j + 1) - 10,
      r * Math.sin(index * unitAngle),
    ]
  )
}

function calcRotation(index, photoListLength) {
  const unitAngle = 2 * Math.PI / photoListLength
  return Math.PI / 2 - index * unitAngle
}

