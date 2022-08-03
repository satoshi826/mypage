import {lazy, Suspense} from 'react'
import {Route} from 'wouter'
import Frame from './frame/Frame'
import {Sky} from '@react-three/drei'

import Gallery from './pages/gallery/Gallery'

const ThreeBase = lazy(() => import('./ThreeBase'))
const Top = lazy(() => import('./pages/top/Top'))
// const Gallery = lazy(() => import('./pages/gallery/Gallery'))

export default function App() {

  return (
    <Frame>
      <Suspense fallback={null}>
        <ThreeBase>
          <Route path="/top" />
          <Route path="/gallery" component={Gallery}/>
          <Route path="/about" />
          <Route path="/link" />
          <Route path=""/>
        </ThreeBase>
      </Suspense>
    </Frame>
  )
}

