import {Suspense, useRef} from 'react'
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil'
import {Canvas, useFrame} from '@react-three/fiber'
import {useDetectGPU} from '@react-three/drei'
import {EffectComposer, Bloom, DepthOfField} from '@react-three/postprocessing'
import {useIsTransition} from './hooks/usePageTransition'
import {useIsSwipingValue} from './frame/useSidebar'
import {useSelectedPhoto} from './pages/gallery/Gallery'

import TransitionRouter from './TransitionRouter'
import MainLight from './mesh/MainLight'
import MainRoom from './mesh/Room'

export default function ThreeRoot() {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const isTransition = useIsTransition()
  const isSwiping = useIsSwipingValue()
  const isExistSelectedPhoto = !!useSelectedPhoto()


  return(
    <Canvas
      dpr={Math.min(window.devicePixelRatio, 2)}
      camera={{fov: 90, near: 5, far: 180}}
      css={ (isSwiping || isExistSelectedPhoto || isTransition) && {pointerEvents: 'none'}}
      gl={{antialias: false}}
      performance={{
        current : 1,
        min     : 0.2,
        max     : 1,
        debounce: 500,
      }}
    >
      <RecoilBridge>
        {/* <fog attach="fog" args={['#bbb', 10, 1000]} /> */}
        <MainLight/>
        <MainRoom/>
        <Suspense fallback={null}>
          <TransitionRouter/>
        </Suspense>
        <Suspense fallback={null}>
          <ResponsiveZoom/>
        </Suspense>
        <Suspense fallback={null}>
          <Effect/>
        </Suspense>
      </RecoilBridge>
    </Canvas>
  )
}

function Effect() {
  const isExistSelectedPhoto = useSelectedPhoto()
  const isTransition = useIsTransition()
  const GPUTier = useDetectGPU().tier

  return (
    <EffectComposer sample={0}>
      {
        isExistSelectedPhoto ?
          GPUTier > 2 && <DepthOfField focusDistance={0.0202} focalLength={0.02} bokehScale={6}/>
          :
          <Bloom
            kernelSize={0}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.3}
            intensity={isTransition ? 4 : 3}
          />
      }
    </EffectComposer>
  )
}

function ResponsiveZoom() {
  const aspectRatioPre = useRef(1)
  useFrame((state) => {
    const aspectRatio = window.innerWidth / window.innerHeight
    if (aspectRatio !== aspectRatioPre) {
      state.camera.zoom = Math.min(1.2 * (window.innerWidth / window.innerHeight), 1)
      aspectRatioPre.curret = aspectRatioPre
    }
  })
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