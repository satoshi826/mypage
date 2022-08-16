import {Suspense, useLayoutEffect, useEffect} from 'react'
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil'
import {Canvas, useThree, useFrame} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import {EffectComposer, Bloom, SMAA, GodRays} from '@react-three/postprocessing'
import useIsMobile from './hooks/useIsMobile'
import {useIsSwipingValue} from './frame/useSidebar'

import MainLight from './mesh/MainLight'
import MainRoom from './mesh/MainRoom'
import FrameLight from './mesh/FrameLight'

export default function ThreeBase({children}) {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const isMobile = useIsMobile()
  const isSwiping = useIsSwipingValue()

  return(
    <Canvas
      dpr={window.devicePixelRatio}
      camera={{fov: isMobile ? 110 : 90, position: [70, 20, 0], near: 2, far: 200}}
      style={{pointerEvents: isSwiping && 'none', height: '100%'}}
    >
      <RecoilBridge>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <MainLight position={[0, 0, 0]} intensity={1.2} distance={140}/>
        <FrameLight />
        <MainRoom/>
        <OrbitControls />
        <Effect/>
      </RecoilBridge>
    </Canvas>
  )
}

function Effect() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        kernelSize={16}
        luminanceThreshold={0}
        luminanceSmoothing={0.8}
        intensity={1}
      />
    </EffectComposer>
  )
}

function FPSLimiter({fps}) {
  const set = useThree((state) => state.set)
  const get = useThree((state) => state.get)
  const advance = useThree((state) => state.advance)
  const frameloop = useThree((state) => state.frameloop)

  useLayoutEffect(() => {
    const initFrameloop = get().frameloop

    return () => {
      set({frameloop: initFrameloop})
    }
  }, [])

  useFrame((state) => {
    if (state.get().blocked) return
    state.set({blocked: true})

    setTimeout(() => {
      state.set({blocked: false})
      state.advance()
    }, Math.max(0, 1000 / fps - state.clock.getDelta()))
  })

  useEffect(() => {
    if (frameloop !== 'never') {
      set({frameloop: 'never'})
      advance()
    }
  }, [frameloop])

  return null
}