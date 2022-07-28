import {useThemeCallback} from '../../theme/useTheme'
import useIsMobile from '../../hooks/useIsMobile'
import {useIsOpenSidebarValue, useIsSwipingValue, useIsPositionValue, useCloseSwipe} from '../useSidebar'
import Nav from './Nav'

export default function Sidebar() {

  const isMobile = useIsMobile()
  const isOpenSidebar = useIsOpenSidebarValue()
  const isSwiping = useIsSwipingValue()
  const positionSwiping = useIsPositionValue()

  const closeSwipeHandler = useCloseSwipe()

  console.log({isMobile, isOpenSidebar, isSwiping})

  const css = useThemeCallback(isMobile
    ? getCssMobile(isOpenSidebar, isSwiping, positionSwiping)
    : getCssPC(isOpenSidebar)
  )

  return (
    <div css={css} {...closeSwipeHandler}>
      <Nav name="Top" url="/top" />
      <Nav name="Gallery" url="/gallery" />
      <Nav name="About" url="/about" />
      <Nav name="Link" url="/link" />
    </div>
  )
}

const getCssMobile = (isOpenSidebar, isSwiping, positionSwiping) => ({pallete, shape}) => {

  const sidebarWidth = parseInt(shape.sidebar.width.slice(0, -2))
  const position = (((isSwiping ? positionSwiping : (isOpenSidebar ? sidebarWidth : 0)) - sidebarWidth)) + 'px'

  return{
    transition    : isSwiping || 'all .35s',
    padding       : '20px 15px',
    background    : rgbaFromHEX(pallete.background[2], 0.6),
    minWidth      : shape.sidebar.width,
    minHeight     : 'calc( 100% - ' + shape.topbar.height + ' )',
    position      : 'absolute',
    backdropFilter: 'blur(4px) saturate(150%)',
    zIndex        : '10000',
    opcity        : '0.8',
    transform     : 'translateX(' + position + ')',
  }
}

const getCssPC = (isOpenSidebar) => ({pallete, shape}) => ({
  transition: 'all .35s',
  padding   : '20px 15px',
  background: pallete.background[2],
  minWidth  : shape.sidebar.width,
  transform : isOpenSidebar || 'translateX(-230px)',
})

function rgbaFromHEX(hex, alpha) {
  const r = parseInt(hex[1] + hex[2], 16)
  const g = parseInt(hex[3] + hex[4], 16)
  const b = parseInt(hex[5] + hex[6], 16)
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}