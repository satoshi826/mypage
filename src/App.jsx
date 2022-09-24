import {lazy, Suspense} from 'react'
import Frame from './frame/Frame'
import {useIsMobileListener} from './hooks/useIsMobile'

const ThreeRoot = lazy(() => import('./ThreeRoot'))

export default function App() {
  useIsMobileListener()
  return (
    <Frame>
      <Suspense fallback={null}>
        <ThreeRoot/>
      </Suspense>
    </Frame>
  )
}