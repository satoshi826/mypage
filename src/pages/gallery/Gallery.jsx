import {useRef} from 'react'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {ScrollControls} from '@react-three/drei'
import {useIsMobile} from '../../hooks/useIsMobile'
import Photos from './Photos'
import GalleryCamera from './GalleryCamera'
import AutoScroller from './AutoScroller'
import GalleryFadeOut from './GalleryFadeOut'
import GalleryFadeIn from './GalleryFadeIn'

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
  const photosRef = useRef()

  const isMobile = useIsMobile()
  const galleryLight = {
    intensity: 4,
    distance : 80,
    size     : 1,
    power    : isMobile ? 0.25 : 1.5,
    lambda   : 2,
    position : [0, 0, 0],
    flash    : null
  }


  return (
    <ScrollControls pages={10} damping={10} infinite horizontal>
      <Photos galleryLight={galleryLight} ref={photosRef}/>
      <GalleryCamera />
      {isAutoScroll && <AutoScroller />}
      <GalleryFadeOut ref={photosRef}/>
      <GalleryFadeIn galleryLight={galleryLight} ref={photosRef}/>
    </ScrollControls>
  )
}