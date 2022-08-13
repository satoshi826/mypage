import Photos from '../../mesh/Photos'
import {ScrollControls} from '@react-three/drei'

export default function Gallery() {

  return (
    <ScrollControls pages={8}>
      <Photos/>
    </ScrollControls>
  )
}

