import {useisFullScreen, useSetisFullScreen, useSelectedPhoto} from './Gallery'

export default function FullScreenPhoto() {

  const isFullScreen = useisFullScreen()
  const selectedPhoto = useSelectedPhoto()

  const setisFullScreen = useSetisFullScreen()

  const containerCss = getContainerCss(isFullScreen)
  const imgCss = getImgCss(isFullScreen)

  return (
    !!selectedPhoto &&
    <div css={containerCss} onClick={() => setisFullScreen(null)}>
      <img src={`./photos/Hi_${selectedPhoto.id}.webp`} css={imgCss}/>
    </div>
  )
}

const getContainerCss = (isFullScreen) => ({
  position       : 'absolute',
  display        : 'flex',
  flexDirection  : 'column',
  justifyContent : 'center',
  alingItems     : 'center',
  transition     : 'all .6s',
  height         : '100%',
  width          : '100%',
  backgroundColor: '#5551',
  backdropFilter : !!isFullScreen && 'blur(5px) saturate(100%)',
  pointerEvents  : !isFullScreen && 'none',
  zIndex         : 250000,
})

const getImgCss = (isFullScreen) => ({
  transition   : 'all .6s',
  opacity      : isFullScreen ? 1 : 0,
  pointerEvents: !isFullScreen && 'none',
  height       : '85%',
  objectFit    : 'scale-down'
})