import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useIsOpenSidebarValue, useIsSwipingValue, usePositionValue, useCloseSwipe} from '../useSidebar'
import {rgbaFromHEX} from '../../util'
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
    </div>
  )
}

const getCss = ({isSwiping, pallete, shape}) => ({
  transition    : isSwiping || 'all .3s',
  padding       : '20px 12px',
  background    : rgbaFromHEX(pallete.background[2], 0.5),
  backdropFilter: 'blur(5px) saturate(200%)',
  borderRight   : '1px solid ' + pallete.background[2],
  minWidth      : shape.sidebar.width,
  zIndex        : 200000,
})

const getTransformMobile = ({isOpenSidebar, isSwiping, positionSwiping, shape}) => {
  const sidebarWidth = parseInt(shape.sidebar.width.slice(0, -2))
  const position = (((isSwiping ? positionSwiping : (isOpenSidebar ? sidebarWidth : 0)) - sidebarWidth)) + 'px'
  return 'translateX(' + position + ')'
}

const getTransformPc = ({isOpenSidebar, shape}) => {
  return isOpenSidebar || 'translateX(-' + shape.sidebar.width + ')'
}