import {useRef, forwardRef, useEffect} from 'react'
import * as THREE from 'three'
import {useIsTransition, useDoneTransition} from '../../hooks/usePageTransition'
import {useResetLight} from '../../mesh/MainLight'
import {useSetScrollStage} from './Text'
import {useFrame, useThree} from '@react-three/fiber'
import {dampMatrix} from '../../util'
import {useDisactivateMenu} from '../../frame/bottombar/Bottombar'

const damp = THREE.MathUtils.damp

export default forwardRef(function AboutFadeOut(_, {ref1, ref2}) {

  const isTransition = useIsTransition()
  const disactivateMenu = useDisactivateMenu()

  const Transition = () => {

    const resetLight = useResetLight()
    const setScrollStage = useSetScrollStage()
    const doneTransition = useDoneTransition()

    const gateLBarRef = useRef()
    const gateRBarRef = useRef()

    const {camera} = useThree()
    const scrollTextGroup = ref1?.current
    const textGate = ref2?.current

    const cameraPos = camera.position

    const isBarEnabled = useRef(false)
    const isGateClosed = useRef(false)

    useEffect(() => {
      disactivateMenu()
    }, [])

    useFrame((_, delta) => {

      if (gateLBarRef.current && gateRBarRef.current) {

        if(!isBarEnabled.cuurent) {

          gateLBarRef.current.position.y = damp(gateLBarRef.current.position.y, 1, 8, delta)
          gateRBarRef.current.position.y = damp(gateRBarRef.current.position.y, 1, 8, delta)

          if(gateRBarRef.current.position.y > 0) {
            isBarEnabled.cuurent = true
            resetLight({position: [0, -37, -25], power: 0})
            setScrollStage(0)
          }
        }

        if(isBarEnabled.cuurent && !isGateClosed.cuurent) {

          gateLBarRef.current.position.x = damp(gateLBarRef.current.position.x, 0, 8, delta)
          gateRBarRef.current.position.x = damp(gateRBarRef.current.position.x, 0, 8, delta)
          scrollTextGroup.scale.x = damp(scrollTextGroup.scale.x, 0, 8, delta)
          textGate.scale.y = damp(textGate.scale.y, 0, 8, delta)

          if(scrollTextGroup.scale.x < 0.01) {
            gateLBarRef.current.position.y = damp(gateLBarRef.current.position.y, -76, 8, delta)
            gateRBarRef.current.position.y = damp(gateRBarRef.current.position.y, -76, 8, delta)
          }

          if(gateRBarRef.current.position.y < -75) {
            isGateClosed.cuurent = true
            resetLight()
          }
        }

        if(isGateClosed.cuurent) {
          cameraPos.set(...dampMatrix(cameraPos, [0, 0, 62], delta, 6))
          if(cameraPos.z > 60) doneTransition()
        }
      }
    })

    return(
      <group name='gateBar'>
        <mesh position={[-37, -75, -25]} rotation={[0, 0, 0]} ref={gateLBarRef}>
          <planeBufferGeometry args={[0.5, 75]} />
          <meshBasicMaterial color={'#fff'}/>
        </mesh>
        <mesh position={[37, -75, -25]} rotation={[0, 0, 0]} ref={gateRBarRef}>
          <planeBufferGeometry args={[0.5, 75]} />
          <meshBasicMaterial color={'#fff'}/>
        </mesh>
      </group>
    )
  }


  return isTransition && <Transition/>
})