import {useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import {Text3D, Center} from '@react-three/drei'
import F18 from './F1.8'
import textMaterial from './textMaterial'
import {useisTransforming} from './TopFadeOut'

export default function TextMesh({children}) {

  const isTransforming = useisTransforming()

  const textRef = useRef()
  const timeRef = useRef(0)
  let timeTmp = 0

  const material = textMaterial()

  useFrame((_, delta) => {
    const shader = material.userData.shader
    if (shader) {
      shader.uniforms.u_sizeW.value = -textRef.current.matrixWorld.elements[12]
      shader.uniforms.u_time.value = timeRef.current
      timeTmp += (isTransforming) ? delta / 1.5 : 0
      timeRef.current = Math.sin((timeTmp < Math.PI / 2) ? timeTmp : Math.PI / 2)
    }
  })

  return(
    <Center >
      <Text3D
        ref={textRef}
        font={F18}
        size={Math.min(130 / children.length, 60)}
        height={2}
        curveSegments={24}
        bevelEnabled
        bevelThickness={3}
        bevelSize={0.5}
        bevelSegments={24}
        material={material}
      >
        {children}
      </Text3D>
    </Center>
  )
}