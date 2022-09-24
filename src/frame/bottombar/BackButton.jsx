import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useSetSelectedPhoto, useSelectedPhoto,
  useSetIsAutoScroll, useIsAutoScroll} from '../../pages/gallery/Gallery'

export default function BackButton() {

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
    <span onClick={handleClick} css={getLineCss(pallete, shape, isView, isMobile)}>
      <BackButtonIcon isPlay={isPlay}/>
    </span>
  )
}

const getLineCss = ({primary, text}, {sidebar}, isView, isMobile) => ({
  cursor     : 'pointer',
  color      : text[0],
  transition : 'all .25s',
  stroke     : text[1],
  strokeWidth: '2px',
  '&:hover'  : isMobile || {
    stroke     : primary[0],
    strokeWidth: '2px',
  },
  userSelect             : 'none',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)'
})


const BackButtonIcon = ({isPlay}) => {

  const isView = !!useSelectedPhoto()

  const play = [
    'M 5 20 l 0 15',
    'M 5 50 l 0 -15',
    'M 5 20 l 35 15',
    'M 5 50 l 35 -15',
  ]

  const pause = [
    'M 15 20 l 0 15',
    'M 15 50 l 0 -15',
    'M 30 20 l 0 15',
    'M 30 50 l 0 -15',
  ]

  const back = [
    'M 5 20 l 15 15',
    'M 5 50 l 15 -15',
    'M 35 20 l -15 15',
    'M 35 50 l -15 -15',
  ]

  const base = isPlay ? pause : play
  const id = 'play'

  return (
    <svg
      id={id}
      key={isView}
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