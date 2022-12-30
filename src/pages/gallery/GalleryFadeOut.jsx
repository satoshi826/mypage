import {forwardRef, useRef, useState, useEffect, Suspense} from 'react'
import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {SpotLight} from '@react-three/drei'
import {useDoneTransition, useIsTransition} from '../../hooks/usePageTransition'
import {useSetSelectedPhoto, useSetIsAutoScroll, useSetisFullScreen} from './Gallery'
import {useSetLight} from '../../mesh/MainLight'
import {useDisactivateMenu} from '../../frame/bottombar/Bottombar'


const damp = THREE.MathUtils.damp
const startDownTime = 0.5

export default forwardRef(function GalleryFadeOut(_, ref) {

  const isTransition = useIsTransition()
  const disactivateMenu = useDisactivateMenu()

  const Transition = () => {

    const [target] = useState(() => new THREE.Object3D())

    const doneTransition = useDoneTransition()
    const setSelectedPhoto = useSetSelectedPhoto()
    const setisFullScreen = useSetisFullScreen()
    const setIsAutoScroll = useSetIsAutoScroll()
    const setLight = useSetLight()

    useEffect(() => {
      setSelectedPhoto(null)
      setisFullScreen(false)
      setIsAutoScroll(false)
      setLight(pre => ({...pre, size: 0.5, power: 0}))
      disactivateMenu()
    }, [])


    const startTime = useRef()
    const ring = useRef()
    const spotLight = useRef()
    const spotLightOpacity = useRef(0)

    useFrame((state, delta) => {

      if (!startTime.current) startTime.current = state.clock.getElapsedTime()
      const elapsedTime = state.clock.getElapsedTime() - startTime.current

      if(elapsedTime < startDownTime) {
        const power = Math.min(Math.pow(elapsedTime / startDownTime, 2), 1)
        ring.current.material.opacity = power
        spotLightOpacity.current = power
        spotLight.current.intensity = 25 * power
      }

      const cameraPosition = state.camera.position
      const currentAngle = calcAngleFromPosition(cameraPosition)

      if ((currentAngle < Math.PI / 5 || currentAngle > 9 * Math.PI / 5) && elapsedTime > startDownTime) {
        ref.current.position.y = damp(ref.current.position.y, -80, 0.1, delta * 18)
      }

      if(ref.current.position.y < 0) {
        const power = Math.min(Math.pow(Math.max((65 + ref.current.position.y) / 65, 0), 1), 1)
        ring.current.material.opacity = power
        spotLightOpacity.current = power
        spotLight.current.intensity = 30 * power
      }
  
      if(ref.current.position.y < -65) {
        doneTransition()
      }
    })

    return(
      <Suspense fallback={null}>
        <group>
          <mesh ref={ring} position={[0, -36.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringBufferGeometry args={[39, 42, 80]} />
            <meshBasicMaterial color={'#fff'} transparent opacity={0}/>
          </mesh>
          <SpotLight
            ref={{ref1: spotLight, ref2: spotLightOpacity}}
            position={[0, -40, 0]}
            angle={0.7}
            penumbra={0.5}
            decay={1}
            distance={80}
            target={target}
            attenuation={80}
            anglePower={10}
            radiusTop={41.5}
            radiusBottom={41.5}
          />
          <primitive object={target} position={[0, 80, 0]} />
        </group>
      </Suspense>
    )
  }

  return isTransition && <Transition/>
})

function calcAngleFromPosition({x, z}) {
  return 0 < Math.atan2(x, z) ? Math.atan2(x, z) : 2 * Math.PI + Math.atan2(x, z)
}