import Sidebar from './sidebar/Sidebar'
import Topbar from './topbar/Topbar'
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
        </div>
      </div>
    </div>
  )
}

const getCssMobile = ({pallete, shape}) => ({

  appCss: {
    background: pallete.background[1],
    height    : '100%',
  },

  mainCss: {
    display : 'flex',
    flexGrow: '1',
  },


  baseContentCss: {
    position : 'absolute',
    minWidth : '100%',
    minHeight: 'calc( 100% - ' + shape.topbar.height + ' )',
  }

})

const getCssPC = ({pallete, shape}) => ({

  appCss: {
    overflowX    : 'hidden',
    background   : pallete.background[1],
    height       : '100%',
    display      : 'flex',
    flexDirection: 'column'
  },

  mainCss: {
    transition: 'all .35s',
    display   : 'flex',
    flexGrow  : '1',
  },

  baseContentCss: {
    background: pallete.background[1],
    transition: 'all .35s',
    flexGrow  : '1',
    minWidth  : 'calc( 100% - ' + shape.sidebar.width + ' )',
    minHeight : 'calc( 100% - ' + shape.topbar.height + ' )',
  },

  closeContentCss: {
    minWidth : '100%',
    transform: 'translateX(-' + shape.sidebar.width + ')',
  }

})
