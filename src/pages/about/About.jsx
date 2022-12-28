import {useRef} from 'react'
import {ScrollControls} from '@react-three/drei'
import AboutFadeIn from './AboutFadeIn'
import AboutFadeOut from './AboutFadeOut'
import Text from './Text'

export default function About() {

  const scrollTextGroupRef = useRef()
  const gateRef = useRef()

  return (
    <ScrollControls pages={32} damping={10} >
      <AboutFadeIn ref={{ref1: scrollTextGroupRef, ref2: gateRef}}/>
      <AboutFadeOut ref={{ref1: scrollTextGroupRef, ref2: gateRef}}/>
      <Text ref={scrollTextGroupRef}/>
      <mesh position={[0, -37.4, -25]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} ref={gateRef} scale={[1, 0, 1]}>
        <planeBufferGeometry args={[1, 75]} />
        <meshBasicMaterial color={'#fff'}/>
      </mesh>
    </ScrollControls>
  )
}
