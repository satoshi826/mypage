import {Route} from 'wouter'
import Frame from './frame/Frame'
import {ThreeBase} from './ThreeBase'

import Top from './pages/top/Top'

export default function App() {

  return (
    <Frame>
      <ThreeBase>
        <Route path="/top" />
        <Route path="/gallary" />
        <Route path="/about" />
        <Route path="/link" />
        <Route path=""/>
      </ThreeBase>
    </Frame>
  )
}

