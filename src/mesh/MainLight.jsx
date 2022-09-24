import * as THREE from 'three'
import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {useIsMobile} from '../hooks/useIsMobile'
import {useIsTransition} from '../hooks/usePageTransition'
import {useSelectedPhoto} from '../pages/gallery/Gallery'

const damp = THREE.MathUtils.damp

export default function MainLight() {//スクロール速度に合わせて明るさ変更とかおもろそう

  const isMobile = useIsMobile()
  const lightRef = useRef()
  const clickedRef = useRef(false)
  const sphereRef = useRef()
  const prePositionRef = useRef(null)

  const isSelected = !!useSelectedPhoto()
  const isTransition = useIsTransition()

  const baseIntensity = isSelected ? 1 : 5

  const power = isTransition ? 0.4
    : isMobile ? 0.3
      : 2

  const baseDistance = isTransition ? 60
    : isSelected ? 60
      : 80

  const lambda = isTransition ? 1 : 2


  useFrame((state, delta) => {
    const curPosition = state.camera.position.clone()
    if (!prePositionRef.current) prePositionRef.current = curPosition
    const speed = curPosition.clone().sub(prePositionRef.current).length()

    lightRef.current.intensity = Math.min(damp(lightRef.current.intensity, (baseIntensity + power * speed), lambda / 2, delta), 8)
    lightRef.current.distance = Math.min(damp(lightRef.current.distance, (baseDistance + power * speed * 40), lambda, delta), 160)

    if(isSelected && !clickedRef.cuuret) {
      lightRef.current.intensity = 8
      lightRef.current.distance = 160
      clickedRef.cuuret = true
    }

    if(!isSelected) {
      clickedRef.cuuret = false
    }

    const targetSize = isTransition ? 0.5
      : isSelected ? 0.1
        : 1 + 0.3 * power * speed

    const size = Math.min(damp(sphereRef.current.scale.x, targetSize, 2, delta), 2)

    sphereRef.current.scale.set(size, size, size)
    prePositionRef.current = curPosition
  })

  return(
    <group position={[0, 0, 0]} >
      <pointLight intensity={baseIntensity} decay={isSelected ? 1 : 2} ref={lightRef} />
      <mesh ref={sphereRef}>
        <sphereGeometry args={[18, 48, 24]} />
        <meshBasicMaterial wireframe color={'#fff'}/>
      </mesh>
      {/* <spotLight position={[0, 20, 0]} angle={0.8} penumbra={1} decay={2} distance={120} intensity={20} /> */}
    </group>
  )
}
