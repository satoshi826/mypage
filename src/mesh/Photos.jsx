import * as THREE from 'three'
import {useTexture} from '@react-three/drei/core'
import {useRef, useEffect} from 'react'

const photoNum = 4
const MAX_H = 10

export default function Photos () {

  const [h, v] = getHV(photoNum)

  const textures = useTexture(getTexturePaths(photoNum))
  const setTextureFunc = setTextureInit(textures)
  const textureIndex = new Float32Array(new Array(photoNum).fill().map((_, i) => i))

  const ref = useRef()
  const tempPhoto = new THREE.Object3D()

  useEffect(() => {
    let counter = 0
    for (let y = 0; y < v; y++) {
      for (let x = 0; x < h; x++) {
        const id = counter++
        tempPhoto.position.set(...calcPosition(x, y, h))
        tempPhoto.rotation.y = calcRotation(x, h)
        tempPhoto.updateMatrix()
        ref.current.setMatrixAt(id, tempPhoto.matrix)
        ref.current.geometry.setAttribute('textureIndex', new THREE.InstancedBufferAttribute(textureIndex, 1))
      }
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={ref}
      args={[null, null, h * v]}>
      <planeBufferGeometry args={[18, 12, 1]} />
      <meshBasicMaterial color='white' onBeforeCompile={setTextureFunc}/>
    </instancedMesh>
  )
}

//----------------------------------------------------------------

function getTexturePaths(num) {
  return new Array(num).fill().map((_, num) => `./photos/${num}.webp`)
}

function getHV(num) {

  let divisorTable = []
  for (let number = 2; number <= num; number++) {
    if (num % number === 0) {
      let exponent = 0
      while (num % number === 0) {
        exponent++
        num /= number
      }
      divisorTable.push(...new Array(exponent).fill(number))
    }
  }

  let tmpH = 1
  for (let index = 0; index < divisorTable.length; index++) {
    if(tmpH * divisorTable[index] <= MAX_H) {
      tmpH *= divisorTable[index]
    }else break
  }

  const h = (tmpH === 1) ? photoNum : tmpH
  const v = photoNum / h
  return [h, v]
}

function setTextureInit(textures) {
  return (shader) => {
    shader.uniforms.textures = {
      type : 'tv',
      value: textures
    }
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        varying float vTextureIndex;
        attribute float textureIndex;
        varying vec2 vUv;
        `
      ).replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        vUv = uv;
        vTextureIndex=textureIndex;`
      )
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec2 vUv;
        uniform sampler2D textures[2];
        varying float vTextureIndex;`
      )
      .replace(
        '#include <fog_fragment>',
        `#include <fog_fragment>
          float x = vTextureIndex;
          vec4 col = vec4(0, 0, 0, 0);
          col = texture2D(textures[0], vUv ) * step(-0.1, x) * step(x, 0.1);
          col += texture2D(textures[1], vUv ) * step(0.9, x) * step(x, 1.1);
          gl_FragColor = col;
        `
      )
  }
}

function calcPosition(x, y, h) {
  const r = 40
  const unitAngle = 2 * Math.PI / h
  return(
    [
      r * Math.cos(x * unitAngle),
      15 * (y + 1) - 10,
      r * Math.sin(x * unitAngle),
    ]
  )
}

function calcRotation(index, photoListLength) {
  const unitAngle = 2 * Math.PI / photoListLength
  return Math.PI / 2 - index * unitAngle
}


