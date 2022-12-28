import {useIsMobile} from '../../hooks/useIsMobile'
import {useTheme} from '../../theme/useTheme'
import {useScrollStage} from '../../pages/about/Text'

export default function MenuAbout() {

  const {pallete} = useTheme()
  const isMobile = useIsMobile()

  const titleCss = getTitleCss(pallete, isMobile)

  return (
    <div css={barCss} >
      <div css={titleCss} onClick={scroll(100)}>
          Dev
      </div>
      <div css={titleCss} onClick={scroll(420)}>
          Photo
      </div>
      <div css={titleCss} onClick={scroll(740)}>
          Other
      </div>
      <Marker />
    </div>
  )
}

const barCss = {
  display       : 'flex',
  position      : 'relative',
  height        : '100%',
  justifyContent: 'space-between',
  width         : 'min(600px, 100%)',
  margin        : '0px 20px'
}

const getTitleCss = ({text, primary}, isMobile) => ({
  cursor    : 'pointer',
  paddingTop: '20px',
  color     : text[1],
  fontSize  : '21px',
  fontFamily: 'F18',
  textAlign : 'center',
  width     : '80px',
  transition: 'all .4s',
  '&:hover' : {
    color: !isMobile && primary[0],
  },
})

function Marker() {

  const scrollStage = useScrollStage()
  const {pallete} = useTheme()

  return (
    <div css={markerContainerCss}>
      <div css={spacerL(scrollStage)} />
      <div css={getMarkerCss(pallete, scrollStage)} />
      <div css={spacerR(scrollStage)} />
    </div>
  )
}

const markerContainerCss = {
  display       : 'flex',
  zIndex        : 10000,
  top           : '-2px',
  pointerEvents : 'none',
  position      : 'absolute',
  height        : '100%',
  justifyContent: 'space-around',
  width         : '100%',
}

const spacerL = (scrollStage) => ({
  transition: 'all .6s',
  width     : (scrollStage === 1) ? '0%' : '100%'
})

const spacerR = (scrollStage) => ({
  transition: 'all .6s',
  width     : (scrollStage === 3) ? '0%' : '100%'
})

const getMarkerCss = ({primary}, scrollStage) => ({
  transition     : 'all .6s',
  minWidth       : '80px',
  height         : '4px',
  borderRadius   : '8px',
  backgroundColor: scrollStage && primary[0],
  boxShadow      : scrollStage && `
  0 0 2px 0px  ${primary[0]},
  0 0 8px 0px  ${primary[1]},
  0 0 16px 0px  ${primary[2]},
  0 0 24px 0px  ${primary[2]}
  `
})

//--------------------------------

const scroll = (to) => () => {
  const scrollController = document.getElementById('scroll-controller')
  const {scrollHeight, scrollTop} = scrollController
  const target = (to / 1000) * scrollHeight
  scrollTo(scrollController, target, 5 / Math.abs(target - scrollTop), 20)
}

function scrollTo(element, to, speed, step) {
  scrollToX(element, element.scrollTop, to, 0, speed, step)
}

function scrollToX(element, xFrom, xTo, t01, speed, step) {
  if (t01 < 0 || t01 > 1 || speed <= 0) {
    element.scrollTop = xTo
    return
  }
  element.scrollTop = xFrom - (xFrom - xTo) * t01
  t01 += speed * step
  setTimeout(function() {
    scrollToX(element, xFrom, xTo, t01, speed, step)
  }, step)
}

