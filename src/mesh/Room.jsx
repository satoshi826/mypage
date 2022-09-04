import {BackSide} from 'three'

const SCALE_BASE = 150

export default function MainRoom() {

  return(
    <group>
      <InnerRoom/>
      <OuterRoom/>
    </group>
  )
}

function InnerRoom() {

  const tmp = 0.99
  const sideSize = [1 * tmp, 0.5 * tmp]
  const topSize = [1 * tmp, 1 * tmp]

  return(
    <group>
      <InnerWall size={sideSize} position={[0, 0, -SCALE_BASE / 2]}/>
      <InnerWall size={sideSize} position={[0, 0, SCALE_BASE / 2]} rotation={[0, Math.PI, 0]} />
      <InnerWall size={sideSize} position={[SCALE_BASE / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <InnerWall size={sideSize} position={[-SCALE_BASE / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <InnerWall size={topSize} position={[0, SCALE_BASE / 2 * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} />
      <InnerWall size={topSize} position={[0, -SCALE_BASE / 2 * 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

function InnerWall({position, rotation, size}) {
  return(
    <mesh scale={SCALE_BASE} position={position} rotation={rotation}>
      <planeBufferGeometry args={size}/>
      <meshStandardMaterial color='#555' />
    </mesh>
  )
}

function OuterRoom() {
  return(
    <mesh scale={SCALE_BASE * 1.2} >
      <boxBufferGeometry args={ [1, 0.5, 1]} />
      <meshBasicMaterial side={BackSide} color='#000' />
    </mesh>
  )
}