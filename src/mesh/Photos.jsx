// import * as THREE from 'three'
import {useRef, useState, useLayoutEffect} from 'react'
import * as THREE from 'three'
import {useFrame, useThree} from '@react-three/fiber'
import {Html, useScroll} from '@react-three/drei'

const PHOTONUM = 42
const MAX_H = 14 // < 16
const RADIUS = 45
const SIZE = 1.4
const MARGIN_V = 15

export default function Photos () {

  const [h, v] = calcHV(PHOTONUM)

  const idListFlat = new Array(PHOTONUM).fill(0).map((_, i) => i)
  let idList = []
  for (let index = 0; index < v; index++) {
    idList.push(idListFlat.slice(index * h, (index + 1) * h))
  }

  // const {camera} = useThree()

  // useLayoutEffect(() => {
  //   camera.lookAt(new THREE.Vector3(0, 20, 0))
  // }, [])

  return (
    <group position={[0, 5, 0]}>
      {
        idList.map((idList, i) =>
          <group key={i} rotation={[0, (i * Math.PI) / h, 0]} position={[0, i * MARGIN_V, 0]}>
            <PhotoRing idList={idList} />
            <FrameRing idList={idList} />
          </group>
        )
      }
    </group>

  )
}

//----------------------------------------------------------------

function PhotoRing ({idList, position}) {

  // const scroll = useScroll().scroll.current
  // useFrame(() => {})

  const photonum = idList.length

  return (
    <group position={position}>
      {idList.map((id, i) =>
        <Html
          key={id}
          scale={SIZE}
          position={calcPosition(i, photonum)}
          rotation={calcRotation(i, photonum)}
          transform
          style={{pointerEvents: 'none', WebkitUserSelect: 'none', userSelect: 'none'}}
          occlude
        >
          <img src={`./photos/${id}.webp`} />
        </Html>
      )}
    </group>
  )
}

//----------------------------------------------------------------

function FrameRing ({idList, position}) {

  const frameRef = useRef()
  const iinerFrameRef = useRef()
  const tempFrame = new THREE.Object3D()
  const tempIinerFrame = new THREE.Object3D()
  const BASESIZE = 4

  const photonum = idList.length

  useLayoutEffect(() => {
    let counter = 0
    for (let x = 0; x < photonum; x++) {
      const id = counter++
      tempFrame.position.set(...calcPosition(x, photonum))
      tempFrame.rotation.y = calcRotation(x, photonum)[1]
      tempFrame.updateMatrix()
      frameRef.current.setMatrixAt(id, tempFrame.matrix)
      tempIinerFrame.position.set(...calcPosition(x, photonum))
      tempIinerFrame.rotation.y = calcRotation(x, photonum)[1]
      tempIinerFrame.updateMatrix()
      iinerFrameRef.current.setMatrixAt(id, tempFrame.matrix)
    }
    frameRef.current.instanceMatrix.needsUpdate = true
    iinerFrameRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh
        ref={frameRef}
        args={[null, null, photonum]}
        scale={0.985}
        position={position}
      >
        <boxBufferGeometry args={ [SIZE * BASESIZE * 3, SIZE * BASESIZE * 2, 1]} />
        <meshLambertMaterial color='#fff'/>
      </instancedMesh>
      <instancedMesh
        ref={iinerFrameRef}
        args={[null, null, photonum]}
        scale={0.999}
        position={position}
      >
        <planeBufferGeometry args={ [SIZE * BASESIZE * 3 * 0.75, SIZE * BASESIZE * 2 * 0.75]} />
        <meshBasicMaterial color='#888'/>
      </instancedMesh>
    </>
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
  return [0, Math.PI / 2 - x * unitAngle, 0]
}