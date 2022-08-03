import {Html} from '@react-three/drei'
import {useRef, useState} from 'react'

export default function Photo({url, position, rotation}) {

  const ref = useRef()
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)

  return (
    <mesh
      ref={ref}
      scale={clicked ? 8 : 4}
      position = {position}
      rotation = {rotation}
    >
      <boxGeometry args={[4.5, 3, 0.5]}/>
      <meshStandardMaterial color='white'/>
      <Html
        distanceFactor={2.8}
        occlude
        transform
        position={[0, 0, 0.3]}
      >
        <div onClick={() => click(!clicked)}>
          <img src={url} height="400"/>
        </div>
      </Html>
    </mesh>
  )
}