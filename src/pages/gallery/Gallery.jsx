import * as THREE from 'three'
import {useRef} from 'react'
import {useScroll, ScrollControls} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import Photos from '../../mesh/Photos'

const R = 59

export default function Gallery() {

  const cameraPosition = useRef(null)

  return (
    <ScrollControls pages={10} infinite horizontal>
      <GalleryCamera cameraPosition={cameraPosition}/>
      <Photos cameraPosition={cameraPosition}/>
    </ScrollControls>
  )
}

function GalleryCamera() {

  const scroll = useScroll()
  const lightRef = useRef()

  useFrame((state, delta) => {
    const scrollValue = scroll.scroll.current
    state.camera.position.set(...calcCameraPosition(state.camera.position, scrollValue, delta))
    state.camera.rotation.set(...calcCameraRotation(scrollValue))
    lightRef.current.position.set(...calcLightPosition(lightRef.current.position, scrollValue, delta))
    state.camera.updateProjectionMatrix()
  })

  return <pointLight intensity={100} decay={2} distance={26} ref={lightRef}/>
}

//------------------------------------------------------------------------------

function calcCameraRotation(scroll) {
  return(
    [
      0,
      (0.5 + scroll * 2) * Math.PI,
      0
    ]
  )
}

function calcCameraPosition({y}, scroll) { //Θをdampすればよいのでは
  return(
    [
      R * Math.cos(-scroll * 2 * Math.PI),
      y,
      R * Math.sin(-scroll * 2 * Math.PI),
    ]
  )
}

function calcLightPosition({x, y, z}, scroll, delta) {
  return(
    [
      THREE.MathUtils.damp(x, R * Math.cos(-scroll * 2 * Math.PI), 1, delta),
      y,
      THREE.MathUtils.damp(z, R * Math.sin(-scroll * 2 * Math.PI), 1, delta)
    ]
  )
}