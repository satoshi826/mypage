import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useIsOpenSidebarValue, useIsSwipingValue, usePositionValue, useCloseSwipe} from '../useSidebar'
import Nav from './Nav'

export default function Sidebar() {

  const isMobile = useIsMobile()
  const isOpenSidebar = useIsOpenSidebarValue()
  const isSwiping = useIsSwipingValue()
  const positionSwiping = usePositionValue()
  const closeSwipeHandler = useCloseSwipe()
  const {pallete, shape} = useTheme()

  const css = getCss({isOpenSidebar, pallete, shape, isSwiping})

  const transform = isMobile
    ? getTransformMobile({isOpenSidebar, isSwiping, positionSwiping, pallete, shape})
    : getTransformPc({isOpenSidebar, shape})


  return (
    <div css={css} {...closeSwipeHandler} style={{transform}}>
      <Nav name="Top" url="/top" />
      <Nav name="Gallery" url="/gallery" />
      <Nav name="About" url="/about" />
      <Nav name="Link" url="/link" />
    </div>
  )
}

const getCss = ({isSwiping, pallete, shape}) => ({
  transition    : isSwiping || 'all .3s',
  padding       : '10px 15px',
  background    : rgbaFromHEX(pallete.background[2], 0.7),
  backdropFilter: 'blur(6px) saturate(150%)',
  borderRight   : '1px solid ' + pallete.background[2],
  minWidth      : shape.sidebar.width,
  zIndex        : '100000000',
})

const getTransformMobile = ({isOpenSidebar, isSwiping, positionSwiping, shape}) => {
  const sidebarWidth = parseInt(shape.sidebar.width.slice(0, -2))
  const position = (((isSwiping ? positionSwiping : (isOpenSidebar ? sidebarWidth : 0)) - sidebarWidth)) + 'px'
  return'translateX(' + position + ')'
}

const getTransformPc = ({isOpenSidebar, shape}) => {
  return isOpenSidebar || 'translateX(-' + shape.sidebar.width + ')'
}

function rgbaFromHEX(hex, alpha) {
  const r = parseInt(hex[1] + hex[2], 16)
  const g = parseInt(hex[3] + hex[4], 16)
  const b = parseInt(hex[5] + hex[6], 16)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}