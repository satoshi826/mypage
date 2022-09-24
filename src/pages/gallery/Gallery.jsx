import {useRef} from 'react'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {ScrollControls} from '@react-three/drei'
import {useIsTransition} from '../../hooks/usePageTransition'
import Photos from './Photos'
import GalleryCamera from './GalleryCamera'
import AutoScroller from './AutoScroller'
import GalleryFadeOut from './GalleryFadeOut'

//----------------------------------------------------------------

const selectedPhotoState = atom({
  key    : 'selectedPhotoState',
  default: null, //{id, position, rotation}
})

export const useSetSelectedPhoto = () => useSetRecoilState(selectedPhotoState)
export const useSelectedPhoto = () => useRecoilValue(selectedPhotoState)

//----------------------------------------------------------------

const hoverIdState = atom({
  key    : 'hoverIdState',
  default: null,
})

export const useSetHoverId = () => useSetRecoilState(hoverIdState)
export const useHoverId = () => useRecoilValue(hoverIdState)

//----------------------------------------------------------------

const autoScrollState = atom({
  key    : 'autoScrollState',
  default: false,
})

export const useSetIsAutoScroll = () => useSetRecoilState(autoScrollState)
export const useIsAutoScroll = () => useRecoilValue(autoScrollState)

//----------------------------------------------------------------


export default function Gallery() {

  const isAutoScroll = useIsAutoScroll()
  const isTransition = useIsTransition()
  const photosRef = useRef()

  return (
    <ScrollControls pages={10} damping={10} infinite horizontal>
      <Photos ref={photosRef}/>
      <GalleryCamera />
      {isAutoScroll && <AutoScroller />}
      {isTransition && <GalleryFadeOut ref={photosRef}/>}
    </ScrollControls>
  )
}