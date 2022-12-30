import {lazy, Suspense} from 'react'
import Frame from './frame/Frame'
import {useIsMobileListener} from './hooks/useIsMobile'
import {Opening} from './Opening'

const ThreeRoot = lazy(() => import('./ThreeRoot'))

export default function App() {

  useIsMobileListener()
  return (
    <Frame>
      <Suspense fallback={<div css={{height: '100%'}}/>}>
        <ThreeRoot/>
        <Opening/>
      </Suspense>
    </Frame>
  )
}