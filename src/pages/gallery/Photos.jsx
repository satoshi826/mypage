import {useRef, useLayoutEffect, Suspense, forwardRef} from 'react'
import * as THREE from 'three'
import {Image} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useSetSelectedPhoto, useSelectedPhoto, useSetHoverId, useHoverId} from './Gallery'

const PHOTONUM = 42
const IDLIST = new Array(PHOTONUM).fill(0).map((_, i) => i)
const MAX_H = 14 // < 16
const [H] = calcHV(PHOTONUM)
const RADIUS = 40
const SIZE = 1
const MARGIN_V = 12


export default forwardRef(function Photos (props, ref) {

  return (
    <group {...props} ref={ref} >
      <PhotoRings />
      <FrameRings />
      <SelectedPhotoHiRes/>
    </group>
  )
})

//----------------------------------------------------------------


function SelectedPhotoHiRes() {

  const selectedPhoto = useSelectedPhoto()

  return (selectedPhoto &&
    <Suspense fallback={null}>
      <Image
        position={selectedPhoto.position}
        rotation={selectedPhoto.rotation}
        scale={[SIZE * 12, SIZE * 8, 1]}
        url={`./photos/Hi_${selectedPhoto.id}.webp`}
      />
    </Suspense>

  )
}


function PhotoRings () {

  return (
    <group>
      {IDLIST.map((id, i) =>
        <Photo key={id} id={id} i={i}/>
      )}
    </group>
  )
}


function Photo ({id, i}) {

  const isMobile = useIsMobile()
  const setHoverId = useSetHoverId()
  const setHover = isMobile ? () => {} : setHoverId
  const setSelectedPhoto = useSetSelectedPhoto()

  const props = {
    position: calcPosition(i, H, RADIUS + 0.6),
    rotation: calcRotation(i, H),
    scale   : [SIZE * 12, SIZE * 8, 1],
    url     : `./photos/${id}.webp`,
    onClick : (e) => setSelectedPhoto({
      id,
      position: e.object.position,
      rotation: e.object.rotation
    }),
    onPointerOver: () => setHover(id),
    onPointerOut : () => setHover(null)
  }

  return <Image {...props}/>
}


//----------------------------------------------------------------

function FrameRings () {

  const frameRef = useRef()
  const outerRef = useRef()
  const hoverId = useHoverId()
  const selectedPhoto = useSelectedPhoto()

  const tempFrame = new THREE.Object3D()
  const defaultColor = new THREE.Color(0x555555)
  const selectedColor = new THREE.Color(0x999999)
  const darkColor = new THREE.Color(0x555555)

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

  useFrame(() => {
    let counter = 0
    for (let i = 0; i < PHOTONUM; i++) {
      const id = counter++
      const color = (id === selectedPhoto?.id) ? selectedColor
        : selectedPhoto ? darkColor
          : (id === hoverId) ? selectedColor
            : defaultColor
      frameRef.current.setColorAt(id, color)
    }
    frameRef.current.instanceColor.needsUpdate = true
  })

  return (
    <>
      <instancedMesh
        ref={frameRef}
        args={[null, null, PHOTONUM]}
        scale={1}
      >
        <boxBufferGeometry args={[SIZE * 12 + 0.5, SIZE * 8 + 0.5, 1]} />
        <meshLambertMaterial />
      </instancedMesh>
      <instancedMesh
        ref={outerRef}
        args={[null, null, PHOTONUM]}
        scale={1}
      >
        <boxBufferGeometry args={[SIZE * 12 + 1.8, SIZE * 8 + 1.8, 0.25]} />
        <meshBasicMaterial color='#333333' />
      </instancedMesh>
    </>

  )
}


// function FrameRings () {

//   const frameRef = useRef()
//   const outerRef = useRef()
//   const hoverId = useHoverId()
//   const selectedPhoto = useSelectedPhoto()

//   const tempFrame = new THREE.Object3D()
//   const defaultColor = new THREE.Color(0x606060)
//   const selectedColor = new THREE.Color(0x999999)
//   const darkColor = new THREE.Color(0x555555)

//   useLayoutEffect(() => {
//     let counter = 0
//     for (let i = 0; i < PHOTONUM; i++) {
//       const id = counter++
//       tempFrame.position.set(...calcPosition(i, H, RADIUS))
//       tempFrame.rotation.y = calcRotation(i, H)[1]
//       tempFrame.updateMatrix()
//       frameRef.current.setMatrixAt(id, tempFrame.matrix)
//       outerRef.current.setMatrixAt(id, tempFrame.matrix)
//     }
//     frameRef.current.instanceMatrix.needsUpdate = true
//     outerRef.current.instanceMatrix.needsUpdate = true
//   }, [])

//   useFrame(() => {
//     let counter = 0
//     for (let i = 0; i < PHOTONUM; i++) {
//       const id = counter++
//       const color = (id === selectedPhoto?.id) ? selectedColor
//         : selectedPhoto ? darkColor
//           : (id === hoverId) ? selectedColor
//             : defaultColor
//       frameRef.current.setColorAt(id, color)
//     }
//     frameRef.current.instanceColor.needsUpdate = true
//   })

//   return (
//     <>
//       <instancedMesh
//         ref={frameRef}
//         args={[null, null, PHOTONUM]}
//         scale={1}
//       >
//         <boxBufferGeometry args={[SIZE * 12 + 0.5, SIZE * 8 + 0.5, 1]} />
//         <meshLambertMaterial />
//       </instancedMesh>
//       <instancedMesh
//         ref={outerRef}
//         args={[null, null, PHOTONUM]}
//         scale={1}
//       >
//         <boxBufferGeometry args={[SIZE * 12 + 1.8, SIZE * 8 + 1.8, 0.25]} />
//         <meshBasicMaterial color='#282828' />
//       </instancedMesh>
//     </>

//   )
// }


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
      (v - 1) * MARGIN_V,
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