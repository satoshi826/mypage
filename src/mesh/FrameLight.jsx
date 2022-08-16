import {BackSide} from 'three'

export default function FrameLight() {

  return(
    <>
      <mesh scale={10} position={[0, 40, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]} >
        <torusBufferGeometry args={[11.4, 0.1, 30, 4]}/>
        <meshBasicMaterial color='#fff' />
      </mesh>
      <mesh scale={10} position={[0, -40, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]} >
        <torusBufferGeometry args={[11.4, 0.1, 30, 4]}/>
        <meshBasicMaterial color='#fff' />
      </mesh>
    </>
  )
}