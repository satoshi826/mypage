import * as THREE from 'three'
import {useRef} from 'react'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useFrame} from '@react-three/fiber'
import {dampMatrix} from '../util'

const damp = THREE.MathUtils.damp

//----------------------------------------------------------------

const defaultLight = {
  intensity: 5,
  distance : 80,
  size     : 0.5,
  power    : 2,
  lambda   : 3,
  position : [0, 0, 0],
  flash    : null
}

const openingLight = {
  intensity: 40,
  distance : 250,
  size     : 1,
  power    : 0,
  lambda   : 1,
  position : [0, 0, 0],
  flash    : null
}

const lightState = atom({
  key    : 'lightState',
  default: openingLight
})

export const useLight = () => useRecoilValue(lightState)
export const useSetLight = () => useSetRecoilState(lightState)
export const useResetLight = () => {
  const setLight = useSetRecoilState(lightState)
  return (option = {}) => setLight({...defaultLight, ...option})
}

//----------------------------------------------------------------

export default function MainLight() {//スクロール速度に合わせて明るさ変更とかおもろそう

  const lightRef = useRef()
  const groupRef = useRef()

  const preCameraPos = useRef(null)

  const {intensity, distance, power, size, lambda, position, flash} = useLight()
  const setLight = useSetLight()

  useFrame((state, delta) => {

    if(flash) {
      lightRef.current.intensity = flash.intensity
      lightRef.current.distance = flash.distance
      setLight(pre => ({...pre, flash: null}))
    }

    const cameraPos = state.camera.position.clone()
    if (!preCameraPos.current) preCameraPos.current = cameraPos
    const speed = cameraPos.clone().sub(preCameraPos.current).length()

    lightRef.current.intensity = damp(lightRef.current.intensity, (intensity + power * speed), lambda / 2, delta)
    lightRef.current.distance = damp(lightRef.current.distance, (distance + power * speed * 40), lambda, delta)

    if(position) {
      let pos = groupRef.current.position
      const res = dampMatrix(pos, position, delta, lambda * 2)
      pos.x = res[0]
      pos.y = res[1]
      pos.z = res[2]
    }

    const targetSize = Math.min(size + 0.3 * power * speed, 2 * size)
    const deltaSize = damp(groupRef.current.scale.x, targetSize, lambda, delta)

    groupRef.current.scale.set(deltaSize, deltaSize, deltaSize)
    preCameraPos.current = cameraPos
  })

  return(
    <group ref={groupRef} name='mainLight'>
      <pointLight decay={2} ref={lightRef} intensity={openingLight.intensity} distance={openingLight.distance}/>
      <mesh rotation={[0, 0, 0]} scale={[openingLight.size, openingLight.size, openingLight.size]}>
        <sphereBufferGeometry args={[18, 48, 24]}/>
        <meshBasicMaterial wireframe color={'#fff'}/>
      </mesh>
    </group>
  )
}