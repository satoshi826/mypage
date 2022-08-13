import {lazy, Suspense} from 'react'
import {Route} from 'wouter'
import Frame from './frame/Frame'

const ThreeBase = lazy(() => import('./ThreeBase'))
const Top = lazy(() => import('./pages/top/Top'))
const Gallery = lazy(() => import('./pages/gallery/Gallery'))

// const Gallery = lazy(() => import('./pages/gallery/Gallery'))

export default function App() {

  return (
    <Frame>
      <Suspense fallback={null}>
        <ThreeBase>
          <Route path="/top" component={Top}/>
          <Route path="/gallery" component={Gallery}/>
          <Route path="/about" />
          <Route path="/link" />
          <Route path=""/>
        </ThreeBase>
      </Suspense>
    </Frame>
  )
}

