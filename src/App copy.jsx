import {lazy, Suspense} from 'react'
import {Route} from 'wouter'
import Frame from './frame/Frame'
import {useIsMobileListener} from './hooks/useIsMobile'

import {useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'

const ThreeBase = lazy(() => import('./ThreeBase'))
const Top = lazy(() => import('./pages/top/Top'))
const Gallery = lazy(() => import('./pages/gallery/Gallery'))

// const Gallery = lazy(() => import('./pages/gallery/Gallery'))

export default function App() {

  useIsMobileListener()

  return (
    <Frame>
      <Suspense fallback={null}>
        {/* <ThreeBase>
          <Route path="/top" component={Top}/>
          <Route path="/gallery" component={Gallery}/>
          <Route path="/about" />
          <Route path="/link" />
          <Route path=""/>
        </ThreeBase> */}
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <Box position={[-1.2, 0, 0]} />
          <Box position={[1.2, 0, 0]} />
        </Canvas>
      </Suspense>
    </Frame>
  )
}




function Box(props) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => {
        click(!clicked)
        console.log('hoge')
      }}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
