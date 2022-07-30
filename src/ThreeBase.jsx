import {Suspense} from 'react'
import {useRecoilBridgeAcrossReactRoots_UNSTABLE} from 'recoil'
import {Canvas} from '@react-three/fiber'
import {ScrollControls, PointerLockControls, Sky} from '@react-three/drei'
import {useIsOpenSidebarValue} from './frame/useSidebar'

export function ThreeBase({children}) {

  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()

  return(
    <Canvas >
      <RecoilBridge>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <Sky scale={1000} sunPosition={[450, 500, 450]} />
          {children}
        </Suspense>
      </RecoilBridge>
    </Canvas>
  )
}