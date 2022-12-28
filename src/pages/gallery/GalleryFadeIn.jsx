import {forwardRef, useEffect, useReducer} from 'react'
import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useSetLight} from '../../mesh/MainLight'

const damp = THREE.MathUtils.damp

export default forwardRef(function GalleryFadeIn({galleryLight}, ref) {

  const [isTransition, endTransition] = useReducer(() => false, true)

  const Transition = () => {

    const setLight = useSetLight()

    useEffect(() => {
      if(!isTransition) {
        setLight({...galleryLight, flash: {intensity: 8, distance: 160}})
        ref.current.scale.set(0, 0, 0)
      }
    }, [])

    useFrame((_, delta) => {
      ref.current.rotation.y = damp(ref.current.rotation.y, 2 * Math.PI + 0.001, 3, delta)
      const targetScale = damp(ref.current.scale.x, 1, 3, delta)
      ref.current.scale.set(targetScale, targetScale, targetScale)
      if(ref.current.rotation.y > 2 * Math.PI) endTransition(false)

    })
  }

  return isTransition && <Transition />
})