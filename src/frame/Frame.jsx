import Sidebar from './sidebar/Sidebar'
import Topbar from './topbar/Topbar'
import Bottombar from './bottombar/Bottombar'
import {useThemeCallback} from '../theme/useTheme'
import {useIsOpenSidebar, useOpenSwipe} from './useSidebar'
import useIsMobile from '../hooks/useIsMobile'

export default function Frame({children}) {

  const isMobile = useIsMobile()
  const [isOpenSidebar, setIsOpenSidebar] = useIsOpenSidebar()
  const {appCss, mainCss, baseContentCss, closeContentCss} = useThemeCallback(isMobile ? getCssMobile : getCssPC)
  const openSwipeHandler = useOpenSwipe()

  const closeSidebar = () => isMobile && isOpenSidebar && setIsOpenSidebar(false)

  return (
    <div css={appCss}>
      <Topbar />
      <div css={mainCss}>
        <Sidebar />
        <div
          css={[baseContentCss, (isOpenSidebar || closeContentCss)]}
          onClick={closeSidebar}
          {...openSwipeHandler}
        >
          {children}
          <Bottombar/>
        </div>
      </div>
    </div>
  )
}

const getCssMobile = ({pallete, shape}) => ({

  appCss: {
    background   : pallete.background[1],
    height       : '100%',
    display      : 'flex',
    flexDirection: 'column'
  },

  mainCss: {
    flexGrow : '1',
    display  : 'flex',
    minHeight: 'calc( 100% - ' + shape.topbar.height + ' )',
    maxHeight: 'calc( 100% - ' + shape.topbar.height + ' )',
  },


  baseContentCss: {
    background   : pallete.text[1],
    position     : 'absolute',
    width        : '100%',
    height       : 'calc( 100% - ' + shape.topbar.height + ' )',
    display      : 'flex',
    flexDirection: 'column',
  }

})

const getCssPC = ({pallete, shape}) => ({

  appCss: {
    overflowX    : 'hidden',
    background   : pallete.background[1],
    height       : '100%',
    display      : 'flex',
    flexDirection: 'column',
  },

  mainCss: {
    transition: 'all .35s',
    flexGrow  : '1',
    display   : 'flex',
    minHeight : 'calc( 100% - ' + shape.topbar.height + ' )',
    maxHeight : 'calc( 100% - ' + shape.topbar.height + ' )',
  },

  baseContentCss: {
    transition     : 'all .35s',
    background     : pallete.background[1],
    width          : 'calc( 100% - ' + shape.sidebar.width + ' )',
    transitionDelay: '300ms',
    display        : 'flex',
    flexDirection  : 'column',
  },

  closeContentCss: {
    minWidth : '100%',
    transform: 'translateX(-' + shape.sidebar.width + ')',
  }

})
