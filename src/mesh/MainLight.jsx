import {useRef} from 'react'

export default function MainLight({position, intensity, distance}) {
  const ref = useRef()
  return(
    <group position={position} >
      <pointLight intensity={intensity} decay={2} distance={distance} ref={ref}/>
      <mesh scale={1} >
        <sphereBufferGeometry args={[4, 15, 20]} />
        {/* <cylinderBufferGeometry args={[0.1, 0.1, 60, 10]} /> */}
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}