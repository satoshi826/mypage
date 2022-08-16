// import * as THREE from 'three'
import {useRef, useState, useLayoutEffect} from 'react'
import * as THREE from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import {Html, useScroll} from '@react-three/drei'

const PHOTONUM = 42
const IDLIST = new Array(PHOTONUM).fill(0).map((_, i) => i)
const MAX_H = 14 // < 16
const [H] = calcHV(PHOTONUM)
const RADIUS = 45
const SIZE = 1.4
const MARGIN_V = 15

export default function Photos () {

  // const {camera} = useThree()
  // useLayoutEffect(() => {
  //   camera.lookAt(new THREE.Vector3(0, 20, 0))
  // }, [])

  return (
    <group position={[0, 0, 0]}>
      <PhotoRings />
      <FrameRings />
    </group>
  )
}

//----------------------------------------------------------------

function PhotoRings () {

  return IDLIST.map((id, i) =>
    <group key={i} position={[0, -MARGIN_V, 0]}>
      <Html
        key={id}
        scale={SIZE}
        position={calcPosition(i, H)}
        rotation={calcRotation(i, H)}
        transform
        style={{pointerEvents: 'none', WebkitUserSelect: 'none', userSelect: 'none'}}
        occlude
      >
        <img src={`./photos/${id}.webp`} />
      </Html>
    </group>
  )
}

//----------------------------------------------------------------

function FrameRings () {

  const frameRef = useRef()
  const tempFrame = new THREE.Object3D()
  const BASESIZE = 4

  useLayoutEffect(() => {
    let counter = 0
    for (let i = 0; i < PHOTONUM; i++) {
      const id = counter++
      tempFrame.position.set(...calcPosition(i, H))
      tempFrame.rotation.y = calcRotation(i, H)[1]
      tempFrame.updateMatrix()
      frameRef.current.setMatrixAt(id, tempFrame.matrix)
    }
    frameRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={frameRef}
      args={[null, null, PHOTONUM]}
      scale={0.985}
      position={[0, -MARGIN_V, 0]}
    >
      <boxBufferGeometry args={ [SIZE * BASESIZE * 3, SIZE * BASESIZE * 2, 1]} />
      <meshLambertMaterial color='#aaa'/>
    </instancedMesh>
  )
}

//----------------------------------------------------------------

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

function calcPosition(i, H) {
  const baseAngle = i * 2 * Math.PI / H
  const v = Math.floor(i / H)
  const offsetAngle = (v * Math.PI) / H
  return(
    [
      RADIUS * Math.cos(baseAngle + offsetAngle),
      v * MARGIN_V,
      RADIUS * Math.sin(baseAngle + offsetAngle),
    ]
  )
}

function calcRotation(i, H) {
  const baseAngle = Math.PI / 2 - (i * 2 * Math.PI / H)
  const v = Math.floor(i / H)
  const offsetAngle = -(v * Math.PI) / H
  return [0, baseAngle + offsetAngle, 0]
}