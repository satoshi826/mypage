import {Route} from 'wouter'
import Frame from './frame/Frame'
import Top from './pages/top/Top'

export default function App() {

  return (
    <Frame >
      <Route path="/top" component={Top} />
      <Route path="/gallary" />
      <Route path="/about" />
      <Route path="/link" />
      <Route path=""/>
    </Frame>
  )
}
