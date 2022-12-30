import {useEffect} from 'react'
import {useFrame} from '@react-three/fiber'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useDoneTransition} from '../../hooks/usePageTransition'
import {useResetLight, useSetLight} from '../../mesh/MainLight'
import {dampMatrix} from '../../util'
import {useDisactivateMenu} from '../../frame/bottombar/Bottombar'

//----------------------------------------------------------------

const isTransformingState = atom({
  key    : 'isTransformingState',
  default: false,
})

export const useSetIsTransforming = () => useSetRecoilState(isTransformingState)
export const useisTransforming = () => useRecoilValue(isTransformingState)

//----------------------------------------------------------------

export default function TopFadeOut({camera, light}) {

  const resetLight = useResetLight()
  const setLight = useSetLight()

  const doneTransition = useDoneTransition()

  const disactivateMenu = useDisactivateMenu()

  const setIsTransforming = useSetIsTransforming()
  const isTransforming = useisTransforming()

  let cameraPos = camera.position
  let cameraRot = camera.rotation

  useEffect(() => {
    resetLight({
      intensity: 4,
      lambda   : 1.5,
      distance : 140,
      position : [0, -25, 0],
      power    : 0
    })
    disactivateMenu()
  }, [])

  useFrame((_, delta) => {

    const {x, y, z} = light.position
    const R = Math.abs(x) + Math.abs(y + 25) + Math.abs(z)


    if (R < 6.5 && !isTransforming) {
      setIsTransforming(true)
      setLight((pre) => ({...pre, size: 0.8, distance: 30, intensity: 8, ...{flash: {distance: 160, intensity: 8}}})) 
    }

    if (R < 0.01 && isTransforming) {
      setIsTransforming(false)
      doneTransition()
    }

    cameraPos.set(...dampMatrix(cameraPos, [0, 0, 70], delta, 3.5))
    cameraRot.set(...dampMatrix(cameraRot, [0, 0, 0], delta, 3.5))
    camera.updateMatrix()

  })

}


