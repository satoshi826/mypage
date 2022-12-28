import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useSetSelectedPhoto, useSelectedPhoto,
  useSetIsAutoScroll, useIsAutoScroll} from '../../pages/gallery/Gallery'
import {useCurrentPage} from '../../hooks/usePageTransition'

export default function MenuGallery() {

  const isMobile = useIsMobile()
  const setSelectedPhoto = useSetSelectedPhoto()
  const isView = !!useSelectedPhoto()

  const {pallete, shape} = useTheme()

  const isPlay = useIsAutoScroll()
  const setIsPlay = useSetIsAutoScroll()

  const handleClick = () => {
    if (isView) (setSelectedPhoto(null), setIsPlay(false))
    if (!isView) (setIsPlay(v => !v))
  }

  return (
    <div onClick={handleClick} css={getLineCss(pallete, shape, isMobile)}>
      <BackButtonIcon isPlay={isPlay}/>
    </div>
  )
}

const getLineCss = ({primary, text}, {bottombar}, isMobile) => ({
  position       : 'absolute',
  cursor         : 'pointer',
  color          : text[0],
  transition     : 'all .4s',
  transitionDelay: 'transform .5s',
  height         : bottombar.height,
  stroke         : text[1],
  strokeWidth    : '2px',
  '&:hover'      : isMobile || {
    stroke     : primary[0],
    strokeWidth: '2px',
  },
  userSelect             : 'none',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
})


const BackButtonIcon = ({isPlay}) => {

  const isView = !!useSelectedPhoto()
  const currentPage = useCurrentPage()

  const key = (currentPage === '/gallery') ? 'active' : 'hidden'

  const play = [
    'M 5 15 l 0 15',
    'M 5 45 l 0 -15',
    'M 5 15 l 35 15',
    'M 5 45 l 35 -15',
  ]

  const pause = [
    'M 15 15 l 0 15',
    'M 15 45 l 0 -15',
    'M 30 15 l 0 15',
    'M 30 45 l 0 -15',
  ]

  const back = [
    'M 5 15 l 15 15',
    'M 5 45 l 15 -15',
    'M 35 15 l -15 15',
    'M 35 45 l -15 -15',
  ]

  const base = isPlay ? pause : play
  const id = 'playIcon'

  return (
    <svg
      id={id}
      key={isView + key}
      width={40}
      height={60}
    >
      {play.map((_, index) => {
        return (
          <path d={isView ? back[index] : base[index]} fill="transparent" css={{pointerEvents: 'none'}} key={index + 'path'} >
            <animate
              attributeName="d"
              from={isView ? base[index] : back[index] }
              to={isView ? back[index] : base[index]}
              dur="0.2s"
              begin="0s"
              fill="freeze"/>
            <animate
              attributeName="d"
              from={isPlay ? play[index] : pause[index] }
              to={isPlay ? pause[index] : play[index]}
              dur="0.2s"
              begin={id + '.click'}
              fill="freeze"/>
          </path>
        )
      })}
    </svg>
  )
}

//   cursor: 'pointer'
// },
// color     : pallete.text[0],
// userSelect: 'none',
// padding   : '15px 15px',
// fontFamily: 'F18',
// fontSize  : '2rem',
// '&::after': {
//   content : '""',
//   position: 'absolute',
//   bottom  : '8px',
//   left    : '0px',
//   right   : '0px',
//   height  : '2px',
//   width   : '0%'
// }