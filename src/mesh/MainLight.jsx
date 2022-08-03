
export default function MainLight({position, intensity, distance}) {
  return(
    <group>
      <pointLight position={position} intensity={intensity} decay={2} distance={distance} castShadow />
      <mesh scale={10} position={position} >
        <sphereBufferGeometry args={[0.2, 30, 30]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}