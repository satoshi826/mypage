import {useState} from 'react'
import {OrbitControls} from '@react-three/drei'
import {useIsTransition} from '../../hooks/usePageTransition'
import TopFadeIn from './TopFadeIn'
import TopFadeOut from './TopFadeOut'
import {useThree} from '@react-three/fiber'
import Text3D from './Text3D'
import LightController from './LightController'

export default function Top() {

  const isTransitionFadeOut = useIsTransition()
  const [transitionFadeInLevel, setTransitionFadeInLevel] = useState(5)

  const camera = useThree(state => state.camera)
  const {scene} = useThree()
  const light = scene.children.find(({name}) => name === 'mainLight')

  const gl = useThree(state => state.gl)
  let {domElement} = gl
  domElement.style.cursor = (transitionFadeInLevel === 0) ? 'grab' : ''

  return (
    <>
      {(transitionFadeInLevel < 4) && <Text3D/>}
      {((!!transitionFadeInLevel && !isTransitionFadeOut) &&
        <TopFadeIn
          transitionFadeInLevel={transitionFadeInLevel}
          setTransitionFadeInLevel={setTransitionFadeInLevel}
          camera={camera}
          light={light}
        />
      )}
      {(!transitionFadeInLevel && !isTransitionFadeOut) &&
        <>
          <OrbitControls
            camera={camera}
            domElement={domElement}
            enablePan={false}
            maxPolarAngle={ 1.95 * Math.PI / 3}
            minPolarAngle={ 1.05 * Math.PI / 3}
            minDistance={10}
            maxDistance={80}
          />
          <LightController light={light}/>
        </>
      }
      {isTransitionFadeOut &&
      <TopFadeOut
        camera={camera}
        light={light}
      />
      }
    </>
  )
}
