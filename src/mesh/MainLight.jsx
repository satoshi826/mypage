import {useRef} from 'react'

export default function MainLight({position, intensity, distance}) {
  const ref = useRef()
  return(
    <group>
      <pointLight position={position} intensity={intensity / 6} decay={2} distance={distance} castShadow ref={ref}/>
      <pointLight position={position} intensity={intensity} decay={2} distance={distance / 4} castShadow ref={ref}/>
      <mesh scale={10} position={position} >
        <sphereBufferGeometry args={[0.2, 30, 30]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}