import {useEffect, useRef, forwardRef, useReducer} from 'react'
import {useFrame, useThree} from '@react-three/fiber'
import {useResetLight, useSetLight} from '../../mesh/MainLight'
import {useIsMobile} from '../../hooks/useIsMobile'
import {dampMatrix} from '../../util'
import {useSetActiveMenu, useActivateMenu} from '../../frame/bottombar/Bottombar'

export default forwardRef(function AboutFadeIn(_, {ref1, ref2}) {

  const [isTransition, endTransition] = useReducer(() => false, true)
  const setActiveMenu = useSetActiveMenu()
  const activateMenu = useActivateMenu()

  const Transition = () => {

    const aboutLight = {
      intensity: 0.4,
      distance : 180,
      power    : 0,
      lambda   : 1.8,
      position : [0, -36.8, -25],
      flash    : {intensity: 3, distance: 90}
    }
  
    const resetLight = useResetLight()
    const setLight = useSetLight()
  
    const isMobile = useIsMobile()
    const cameraZ = isMobile ? 20 : 25
  
    const {scene, camera} = useThree()
    const mainlight = scene.children.find(({name}) => name === 'mainLight')
    const cameraPos = camera.position
    const cameraRot = camera.rotation
  
    const scrollTextGroup = ref1?.current
    const textGate = ref2?.current

    const isDoneMove = useRef(false)

    useEffect(() => {
      resetLight(aboutLight)
      setActiveMenu('about')
    }, [])

    useFrame((state, delta) => {

      if(textGate) {

        cameraPos.set(...dampMatrix(cameraPos, [0, 0, cameraZ - 2], delta, 0.5))
        cameraRot.set(...dampMatrix(cameraRot, [0, 0, 0], delta, 3))

        textGate.scale.y = 1 - (mainlight.scale.x * 2)

        scrollTextGroup.position.y = - 200 * (mainlight.scale.x * 2)

        if(mainlight.position.y < -36 && !isDoneMove.current) {
          isDoneMove.current = true
          setLight(pre => ({...pre, size: 0}))
          activateMenu()
        }

        const gateBar = state.scene.children.find(({name}) => name === 'gateBar')

        if(gateBar || (isDoneMove.current && mainlight.scale.y < 0.005 && Math.abs(cameraPos.z - cameraZ) < 0.005)) {
          endTransition()
        }

      }
    })
  }

  return isTransition && <Transition/>

})
