import {forwardRef, useRef, useState} from 'react'
import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useDoneTransition} from '../../hooks/usePageTransition'
import {useSetSelectedPhoto} from './Gallery'

const damp = THREE.MathUtils.damp
const startDownTime = 0.4

export default forwardRef(function GalleryFadeOut(_, ref) {

  const [target] = useState(() => new THREE.Object3D())

  const doneTransition = useDoneTransition()
  const setSelectedPhoto = useSetSelectedPhoto()
  setSelectedPhoto(null)

  const startTime = useRef()
  const ring = useRef()

  useFrame((state, delta) => {

    if (!startTime.current) startTime.current = state.clock.getElapsedTime()
    const elapsedTime = state.clock.getElapsedTime() - startTime.current

    const cameraPosition = state.camera.position
    const currentAngle = calcAngleFromPosition(cameraPosition)

    if ((currentAngle < Math.PI / 5 || currentAngle > 9 * Math.PI / 5) && elapsedTime > startDownTime) {
      ref.current.position.y = damp(ref.current.position.y, -68, 0.1, delta * 12)
    }

    if(ref.current.position.y < -56) doneTransition()
  })


  return(
    <group>
      <mesh ref={ring} position={[0, -36.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringBufferGeometry args={[38, 42, 80]} />
        <meshStandardMaterial color={'#fff'}/>
      </mesh>
      <spotLight position={[0, 25, 0]} angle={1} penumbra={1} decay={2} distance={90} intensity={100} target={target}/>
      <primitive object={target} position={[0, -80, 0]} />
      {/* <mesh ref={ring} position={[0, -37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringBufferGeometry args={[37, 43, 80]} />
        <meshBasicMaterial color={'#222'}/>
      </mesh> */}
      {/* <pointLight intensity={80} decay={2} position={[0, -40, 0]} distance={80}/> */}
      {/* <mesh >
        <cylinderBufferGeometry args={[38, 38, 80, 80]} />
        <meshStandardMaterial color={'#fff'} transparent opacity={0.1} side={THREE.DoubleSide}/>
      </mesh> */}
      {/* <mesh >
        <cylinderBufferGeometry args={[42, 42, 80, 80]} />
        <meshStandardMaterial color={'#444'} transparent opacity={0.1} side={THREE.BackSide}/>
      </mesh> */}
      {/* <group position={[0, 0, 0]} rotation={[0, 0, 0]} >
        <mesh >
          <cylinderBufferGeometry args={[42, 42, 80, 80]} />
          <meshBasicMaterial color={'#fff'} transparent opacity={0.1}/>
        </mesh>
        <mesh >
          <cylinderBufferGeometry args={[38, 38, 80, 80]} />
          <meshBasicMaterial color={'#fff'} transparent opacity={0.8}/>
        </mesh>
      </group> */}
    </group>
  )
})

function calcAngleFromPosition({x, z}) {
  return 0 < Math.atan2(x, z) ? Math.atan2(x, z) : 2 * Math.PI + Math.atan2(x, z)
}