import {Suspense} from 'react'
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil'
import {Canvas, useFrame} from '@react-three/fiber'
import {EffectComposer, Bloom, SSAO} from '@react-three/postprocessing'
import {useIsMobile} from './hooks/useIsMobile'
import {useIsSwipingValue} from './frame/useSidebar'

import MainLight from './mesh/MainLight'
import MainRoom from './mesh/Room'

export default function ThreeBase({children}) {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const isMobile = useIsMobile()
  const isSwiping = useIsSwipingValue()

  return(
    <Canvas
      dpr={window.devicePixelRatio}
      camera={{fov: isMobile ? 110 : 90, position: [60, 0, 0], near: 2, far: 200}}
      style={{pointerEvents: isSwiping && 'none', height: '100%'}}
    >
      <RecoilBridge>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <MainLight position={[0, 0, 0]} intensity={1.8} distance={150}/>
        <MainRoom/>
        <Effect/>
      </RecoilBridge>
    </Canvas>
  )
}

function Effect() {

  const isMobile = useIsMobile()

  return (
    <EffectComposer multisampling={isMobile ? 1 : 6}>
      <Bloom
        kernelSize={6}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.5}
        intensity={3}
      />
      {isMobile || <SSAO />}
    </EffectComposer>
  )
}

// function FPSLimiter({fps}) {
//   const set = useThree((state) => state.set)
//   const get = useThree((state) => state.get)
//   const advance = useThree((state) => state.advance)
//   const frameloop = useThree((state) => state.frameloop)

//   useLayoutEffect(() => {
//     const initFrameloop = get().frameloop

//     return () => {
//       set({frameloop: initFrameloop})
//     }
//   }, [])

//   useFrame((state) => {
//     if (state.get().blocked) return
//     state.set({blocked: true})

//     setTimeout(() => {
//       state.set({blocked: false})
//       state.advance()
//     }, Math.max(0, 1000 / fps - state.clock.getDelta()))
//   })

//   useEffect(() => {
//     if (frameloop !== 'never') {
//       set({frameloop: 'never'})
//       advance()
//     }
//   }, [frameloop])

//   return null
// }