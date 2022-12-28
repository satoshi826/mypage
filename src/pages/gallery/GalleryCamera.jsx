import * as THREE from 'three'
import {useRef} from 'react'
import {useScroll} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useIsTransition} from '../../hooks/usePageTransition'
import {useSelectedPhoto} from './Gallery'

const damp = THREE.MathUtils.damp

export default function GalleryCamera() {

  const isMobile = useIsMobile()
  const isTransition = useIsTransition()

  const R = isTransition ?
    isMobile ? 72 : 82
    : 60

  const R_DeltaPower = isMobile
    ? 50
    : 100 + window.innerWidth / 10

  const scrollLambda =
  isTransition ? 4
    : isMobile ? 7
      : 5

  const selectedPhotoPosition = useSelectedPhoto()?.position

  const scroll = useScroll()
  const lightRef = useRef()

  useFrame((state, delta) => {

    const cameraPos = state.camera.position
    let currentAngle = calcAngleFromPosition(cameraPos)

    if (selectedPhotoPosition) {
      state.camera.position.set(...calcCameraPositionSelected(selectedPhotoPosition, cameraPos, delta))
      state.camera.rotation.set(0, currentAngle, 0)
    }else{
      const scrollValue = scroll.scroll.current
      const targetAngle = isTransition ? 0 : scrollValue * 2 * Math.PI

      currentAngle = (targetAngle - currentAngle) < -1 * Math.PI ? currentAngle - 2 * Math.PI : currentAngle
      currentAngle = (targetAngle - currentAngle) > 1 * Math.PI ? currentAngle + 2 * Math.PI : currentAngle

      const deltaAngle = damp(currentAngle, targetAngle, scrollLambda, delta)
      const targetR = Math.min(R + Math.abs(deltaAngle - currentAngle) * R_DeltaPower, 85)

      state.camera.position.set(...calcCameraPosition(cameraPos, targetR, deltaAngle, delta))
      state.camera.rotation.set(0, deltaAngle, 0)
    }
    lightRef.current.position.set(...calcLightPosition(lightRef.current.position, state.camera.position, delta))
    state.camera.updateMatrix()
  })

  return (
    <pointLight
      intensity={isTransition ? 0 : selectedPhotoPosition ? 15 : 35}
      decay={1} distance={selectedPhotoPosition ? 20 : 28}
      ref={lightRef}
    />
  )
}


//------------------------------------------------------------------------------

function calcAngleFromPosition({x, z}) {
  return 0 < Math.atan2(x, z) ? Math.atan2(x, z) : 2 * Math.PI + Math.atan2(x, z)
}

function calcCameraPosition({x, y, z}, R, deltaAngle, delta) {

  const currentR = Math.hypot(x, z)
  const deltaR = damp(currentR, R, 3, delta)

  return(
    [
      deltaR * Math.sin(deltaAngle),
      damp(y, 0, 4, delta),
      deltaR * Math.cos(deltaAngle),
    ]
  )
}

function calcLightPosition(light, camera, delta) {

  return(
    [
      damp(light.x, camera.x, 1.2, delta),
      camera.y,
      damp(light.z, camera.z, 1.2, delta)
    ]
  )
}

//------------------------------------------------------------------------------

function calcCameraPositionSelected(photoPosition, {x : currentX, y: currentY, z: currentZ}, delta) {
  const {x, z} = photoPosition.clone().multiplyScalar(1.2)
  return (
    [
      damp(currentX, x, 3, delta),
      damp(currentY, photoPosition.y, 3, delta),
      damp(currentZ, z, 3, delta)
    ]
  )
}