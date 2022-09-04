// import * as THREE from 'three'
import {useRef, useLayoutEffect} from 'react'
import * as THREE from 'three'
import {Preload, Image} from '@react-three/drei'

const PHOTONUM = 42
const IDLIST = new Array(PHOTONUM).fill(0).map((_, i) => i)
const MAX_H = 14 // < 16
const [H] = calcHV(PHOTONUM)
const RADIUS = 40
const SIZE = 1
const MARGIN_V = 12

export default function Photos ({cameraPosition}) {

  return (
    <group position={[0, 0, 0]} >
      <PhotoRings />
      <FrameRings />
    </group>
  )
}

// export default function Photos ({cameraPosition}) {

//   return (
//     <PhotoRings />
//   )
// }


//----------------------------------------------------------------

// function PhotoRings () {

//   const photosRef = useRef()
//   // const clicked = useRef()

//   // const onPointerMove = (e) => {
//   //   e.stopPropagation()
//   //   console.log(e)
//   //   console.log(photosRef)
//   //   clicked.current = photosRef.current.children['0']
//   //   console.log(clicked.current)
//   // }

//   return (
//     <group position={[0, -MARGIN_V, 0]} ref={photosRef} onClick={(e) => console.log(e)}>
//       {IDLIST.map((id, i) =>
//         <mesh
//           key={id}
//           position={calcPosition(i, H, RADIUS + 0.6)}
//           rotation={calcRotation(i, H)}
//           scale={[SIZE * 12, SIZE * 8, 1]}
//           // onPointerMove={(e) => console.log(e.object.position)}
//           // raycast={() => null}
//           onClick={(e) => console.log(e.object.position)}
//         >
//           <planeBufferGeometry/>
//         </mesh>
//       )}
//     </group>
//   )
// }

function PhotoRings () {

  const photosRef = useRef()
  // const clicked = useRef()

  // const onPointerMove = (e) => {
  //   e.stopPropagation()
  //   console.log(e)
  //   console.log(photosRef)
  //   clicked.current = photosRef.current.children['0']
  //   console.log(clicked.current)
  // }

  return (
    <group position={[0, -MARGIN_V, 0]} ref={photosRef} onClick={(e) => console.log(e)}>
      <Preload/>
      {IDLIST.map((id, i) =>
        <Image
          key={id}
          position={calcPosition(i, H, RADIUS + 0.6)}
          rotation={calcRotation(i, H)}
          scale={[SIZE * 12, SIZE * 8, 1]}
          url={`./photos/${id}.webp`}
          // onPointerMove={(e) => console.log(e.object.position)}
          // raycast={() => null}
          // onClick={(e) => console.log(e.object.position)}
        />
      )}
    </group>
  )
}

//----------------------------------------------------------------

function FrameRings () {

  const frameRef = useRef()
  const outerRef = useRef()
  // const hoverId = useRef()

  const tempFrame = new THREE.Object3D()

  useLayoutEffect(() => {
    let counter = 0
    for (let i = 0; i < PHOTONUM; i++) {
      const id = counter++
      tempFrame.position.set(...calcPosition(i, H, RADIUS))
      tempFrame.rotation.y = calcRotation(i, H)[1]
      tempFrame.updateMatrix()
      frameRef.current.setMatrixAt(id, tempFrame.matrix)
      outerRef.current.setMatrixAt(id, tempFrame.matrix)
    }
    frameRef.current.instanceMatrix.needsUpdate = true
    outerRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh
        ref={frameRef}
        args={[null, null, PHOTONUM]}
        scale={1}
        position={[0, -MARGIN_V, 0]}
      >
        <boxBufferGeometry args={[SIZE * 12 + 0.5, SIZE * 8 + 0.5, 1]} />
        <meshLambertMaterial color='#666' />
      </instancedMesh>
      <instancedMesh
        ref={outerRef}
        args={[null, null, PHOTONUM]}
        scale={1}
        position={[0, -MARGIN_V, 0]}
        // onPointerMove={(e) => (hoverId.current = e.instanceId, console.log((e.instanceId)))}
        // onPointerOut={(e) => (hoverId.current = null, console.log((e.instanceId)))}
      >
        <boxBufferGeometry args={[SIZE * 12 + 1.5, SIZE * 8 + 1.5, 0.5]} />
        <meshBasicMaterial color='#222' />
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

function calcPosition(i, H, r) {
  const baseAngle = i * 2 * Math.PI / H
  const v = Math.floor(i / H)
  const offsetAngle = (v * Math.PI) / H
  return(
    [
      r * Math.cos(baseAngle + offsetAngle),
      v * MARGIN_V,
      r * Math.sin(baseAngle + offsetAngle),
    ]
  )
}

function calcRotation(i, H) {
  const baseAngle = Math.PI / 2 - (i * 2 * Math.PI / H)
  const v = Math.floor(i / H)
  const offsetAngle = -(v * Math.PI) / H
  return [0, baseAngle + offsetAngle, 0]
}