import {DoubleSide} from 'three'

export default function MainRoom() {

  return(
    <mesh scale={150} position={[0, 70, 0]} receiveShadow>
      <boxBufferGeometry />
      <meshPhongMaterial side={DoubleSide}/>
    </mesh>

  )
}