import {useRef} from 'react'
import {atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {useFrame} from '@react-three/fiber'

const lightSpeedState = atom({
  key    : 'lightSpeedState',
  default: 5
})

function useLightSpeed() {
  return useRecoilValue(lightSpeedState)
}

export function useSetLightSpeed() {
  return useSetRecoilState(lightSpeedState)
}

export default function LightController({light}) {

  const pos = light?.position
  const time = useRef(0)
  const lightSpeed = useLightSpeed()

  useFrame((_, delta) => {

    const speed = lightSpeed * 0.22
    time.current = delta * speed + (time.current)

    if(pos) {
      pos.x = 70 * Math.sin(time.current + Math.PI)
      pos.y = 20 * Math.sin(time.current * 2.87)
      pos.z = 35 * Math.cos(time.current + Math.PI)
    }
  })

}
