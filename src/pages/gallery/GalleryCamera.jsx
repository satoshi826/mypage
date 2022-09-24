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

  const R = isTransition ? 82 : 60

  const R_DeltaPower =
  isMobile ? 300
    : window.innerWidth / 1.2

  const scrollLambda =
  isTransition ? 2
    : isMobile ? 7
      : 5

  const selectedPhotoPosition = useSelectedPhoto()?.position

  const scroll = useScroll()
  const lightRef = useRef()

  useFrame((state, delta) => {

    const cameraPosition = state.camera.position
    let currentAngle = calcAngleFromPosition(cameraPosition)

    if (selectedPhotoPosition) {
      state.camera.position.set(...calcCameraPositionSelected(selectedPhotoPosition, cameraPosition, delta))
      state.camera.rotation.set(0, currentAngle, 0)
    }else{
      const scrollValue = scroll.scroll.current
      const targetAngle = isTransition ? 0 : scrollValue * 2 * Math.PI

      currentAngle = (targetAngle - currentAngle) < -1 * Math.PI ? currentAngle - 2 * Math.PI : currentAngle
      currentAngle = (targetAngle - currentAngle) > 1 * Math.PI ? currentAngle + 2 * Math.PI : currentAngle

      const deltaAngle = damp(currentAngle, targetAngle, scrollLambda, delta)
      const targetR = Math.min(R + scroll.delta * R_DeltaPower, 85)

      state.camera.position.set(...calcCameraPosition(cameraPosition, targetR, deltaAngle, delta))
      state.camera.rotation.set(0, deltaAngle, 0)
    }
    lightRef.current.position.set(...calcLightPosition(lightRef.current.position, state.camera.position, delta))
    state.camera.updateProjectionMatrix()
  })

  return <pointLight
    intensity={isTransition ? 0 : selectedPhotoPosition ? 15 : 35}
    decay={1} distance={selectedPhotoPosition ? 20 : 28}
    ref={lightRef}
  />
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
      damp(light.x, camera.x, 1.5, delta),
      camera.y,
      damp(light.z, camera.z, 1.5, delta)
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