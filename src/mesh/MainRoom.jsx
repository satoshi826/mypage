import {BackSide} from 'three'

export default function MainRoom() {

  return(
    <group>
      <mesh scale={160} position={[0, 0, 0]} receiveShadow>
        <boxBufferGeometry args={ [1, 0.5, 1]} />
        <meshStandardMaterial side={BackSide} color='#666'/>
      </mesh>
      <Outer scale={180}/>
    </group>
  )
}

function Outer(props) {
  return (
    <mesh {...props}>
      <boxBufferGeometry args={ [1, 0.5, 1]} />
      <meshBasicMaterial side={BackSide} color='#eee'/>
    </mesh>
  )
}

function Walls () {

  const frameRef = useRef()
  const tempFrame = new THREE.Object3D()
  const BASESIZE = 4

  useLayoutEffect(() => {
    let counter = 0
    for (let i = 0; i < PHOTONUM; i++) {
      const id = counter++
      tempFrame.position.set(...calcPosition(i, H))
      tempFrame.rotation.y = calcRotation(i, H)[1]
      tempFrame.updateMatrix()
      frameRef.current.setMatrixAt(id, tempFrame.matrix)
    }
    frameRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh
      ref={frameRef}
      args={[null, null, PHOTONUM]}
      scale={0.985}
      position={[0, -MARGIN_V, 0]}
    >
      <boxBufferGeometry args={ [SIZE * BASESIZE * 3, SIZE * BASESIZE * 2, 1]} />
      <meshLambertMaterial color='#aaa'/>
    </instancedMesh>
  )
}
