import {BackSide} from 'three'
export default function MainRoom() {

  return(
    <mesh >
      <boxBufferGeometry args={ [150, 75, 150]} />
      <meshPhongMaterial side={BackSide} color='#777' />
    </mesh>
  )
}