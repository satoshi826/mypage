import {useEffect} from 'react'
import {useFrame} from '@react-three/fiber'
import {useResetLight, useSetLight} from '../../mesh/MainLight'
import {dampMatrix} from '../../util'

export default function TopFadeIn({transitionFadeInLevel, setTransitionFadeInLevel, camera, light}) {

  const resetLight = useResetLight()
  const setLight = useSetLight()

  useEffect(() => {
    resetLight({
      intensity: 4,
      lambda   : 2,
      distance : 100,
      position : [0, -28, -35],
      size     : 0.1,
      power    : 0
    })
  }, [])

  let cameraPos = camera.position

  useFrame((_, delta) => {

    const lightSize = light.scale.x

    if (transitionFadeInLevel === 5 && lightSize < 0.3) {
      setTransitionFadeInLevel(4)
      setLight((pre) => ({
        ...pre,
        intensity: 1,
        distance : 1,
        size     : 0,
        lambda   : 4,
      }))
    }

    if (transitionFadeInLevel === 4 && lightSize < 0.01) {
      setTransitionFadeInLevel(3)
    }

    if (transitionFadeInLevel === 3 && lightSize < 0.0001) {
      setTransitionFadeInLevel(2)
      setLight((pre) => ({
        ...pre,
        intensity: 12,
        lambda   : 1,
        distance : 160,
        size     : 0.12,
      }))
    }

    if (transitionFadeInLevel === 2 && lightSize > 0.1) {
      setTransitionFadeInLevel(1)
      setLight((pre) => ({
        ...pre,
        intensity: 4,
        lambda   : 3,
        distance : 100,
        position : [0, 0, -35]
      }))
    }

    if (transitionFadeInLevel === 1 && cameraPos.y > 0) {
      setTransitionFadeInLevel(0)
    }

    const target = {
      5: [0, -28, 70],
      4: [0, -28, 70],
      3: [0, -28, 70],
      2: [0, -28, 70],
      1: [0, 1, 70],
    }[transitionFadeInLevel]

    const lambda = {
      5: 2.5,
      4: 2.5,
      3: 2,
      2: 4,
      1: 6
    }[transitionFadeInLevel]

    cameraPos.set(...dampMatrix(cameraPos, target, delta, lambda))


    camera.updateMatrix()
  })

}

