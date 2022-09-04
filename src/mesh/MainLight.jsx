
export default function MainLight({position, intensity, distance}) {//スクロール速度に合わせて明るさ変更とかおもろそう
  return(
    <group position={position} scale={1}>
      <pointLight intensity={intensity} decay={2} distance={distance} />
      <mesh >
        <sphereBufferGeometry args={[3, 20, 20]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  )
}
