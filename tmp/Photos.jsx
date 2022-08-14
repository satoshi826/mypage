import * as THREE from 'three'
import {useTexture} from '@react-three/drei/core'
import {useRef, useLayoutEffect} from 'react'

const PHOTONUM = 8
const MAX_H = 4 // < 16
const RADIUS = 50
const SIZE = 6
const SHAPE = [SIZE * 3, SIZE * 2, 1]

export default function Photos () {

  const [h, v] = calcHV(PHOTONUM)
  const textures = useTexture(getTexturePaths(PHOTONUM))

  let texturesPerRing = []

  for (let index = 0; index < v; index++) {
    texturesPerRing.push(textures.slice(index * h, (index + 1) * h))
  }

  return (
    texturesPerRing.map((textures, i) =>
      <Ring
        key={i}
        textures={textures}
        position={[0, i * 15, 0]}
      />)
  )
}

//----------------------------------------------------------------

function Ring ({textures, position}) {

  const photonum = textures.length
  const setTextureFunc = setTextureInit(textures)
  const textureIndex = new Float32Array(new Array(photonum).fill().map((_, i) => i))

  const ref = useRef()
  const tempPhoto = new THREE.Object3D()

  useLayoutEffect(() => {
    let counter = 0
    for (let x = 0; x < photonum; x++) {
      const id = counter++
      tempPhoto.position.set(...calcPosition(x, photonum))
      tempPhoto.rotation.y = calcRotation(x, photonum)
      tempPhoto.updateMatrix()
      ref.current.setMatrixAt(id, tempPhoto.matrix)
      ref.current.geometry.setAttribute('textureIndex', new THREE.InstancedBufferAttribute(textureIndex, 1))
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={ref}
      args={[null, null, PHOTONUM]}
      position={position}

    >
      <planeBufferGeometry args={SHAPE}/>
      <meshBasicMaterial color='white' onBeforeCompile={setTextureFunc} side={THREE.DoubleSide}/>
    </instancedMesh>
  )
}

//----------------------------------------------------------------


function getTexturePaths(num) {
  return new Array(num).fill().map((_, num) => `./photos/${num}.webp`)
}

function calcHV(num) {

  let h = MAX_H
  let index
  for (index = 0; index < MAX_H; index++) {
    if(num % (MAX_H - index) === 0) {
      h = MAX_H - index
      break
    }
  }

  h = (index === MAX_H - 1) ? num : h
  const v = PHOTONUM / h
  return [h, v]
}

function calcPosition(x, photonum) {
  const unitAngle = 2 * Math.PI / photonum
  return(
    [
      RADIUS * Math.cos(x * unitAngle),
      0,
      RADIUS * Math.sin(x * unitAngle),
    ]
  )
}

function calcRotation(x, photonum) {
  const unitAngle = 2 * Math.PI / photonum
  return Math.PI / 2 - x * unitAngle
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
        attribute float textureIndex;
        varying float vTextureIndex;
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
        uniform sampler2D textures[${textures.length}];
        varying float vTextureIndex;`
      )
      .replace(
        '#include <fog_fragment>',
        `#include <fog_fragment>
        vec4 col = vec4(0, 0, 0, 0);
        ${swichTexture(textures)}
        gl_FragColor = col;
        `
      )
  }
}

function swichTexture(textures) {

  return textures.reduce((res, _, i) => {
    res += `col += texture2D(textures[${i}], vUv ) * step(${i - 0.1}, vTextureIndex) * step(vTextureIndex, ${i + 0.1});`
    return res
  }, '')
}