import {Suspense} from 'react'
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil'
import {Canvas} from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
import useIsMobile from './hooks/useIsMobile'
import {useIsSwipingValue} from './frame/useSidebar'

import MainLight from './mesh/MainLight'
import MainRoom from './mesh/MainRoom'

export default function ThreeBase({children}) {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const isMobile = useIsMobile()
  const isSwiping = useIsSwipingValue()

  return(
    <Canvas camera={{fov: isMobile ? 100 : 90, position: [70, 5, 0]}} shadows style={{pointerEvents: isSwiping && 'none'}}>
      <RecoilBridge>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <MainLight position={[0, 3, 0]} intensity={0.4} distance={120}/>
        <MainRoom/>
        <OrbitControls />
      </RecoilBridge>
    </Canvas>
  )
}