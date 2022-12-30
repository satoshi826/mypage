import Sidebar from './sidebar/Sidebar'
import Topbar from './topbar/Topbar'
import Bottombar from './bottombar/Bottombar'
import {useTheme} from '../theme/useTheme'
import {useIsOpenSidebar} from './useSidebar'
import {useIsMobile} from '../hooks/useIsMobile'
import {useActiveMenu} from './bottombar/Bottombar'
import {useSelectedPhoto} from '../pages/gallery/Gallery'
import FullScreenPhoto from '../pages/gallery/FullScreenPhoto'


export default function Frame({children}) {

  const isMobile = useIsMobile()
  const [isOpenSidebar, setIsOpenSidebar] = useIsOpenSidebar()
  const {pallete, shape} = useTheme()
  const {appCss, mainCss, baseContentCss, closeContentCss} = isMobile ? getCssMobile({pallete, shape}) : getCssPC({pallete, shape})

  const closeSidebar = () => (isMobile && isOpenSidebar) && setIsOpenSidebar(false)

  return (
    <div css={appCss} >
      <FullScreenPhoto/>
      <ScrollStyle/>
      <Topbar />
      <div css={mainCss}>
        <Sidebar />
        <div
          css={[baseContentCss, (isOpenSidebar || closeContentCss)]}
          onClick={closeSidebar}
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
    // overflow     : 'hidden',
    background   : pallete.background[0],
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
    position     : 'absolute',
    overflow     : 'hidden',
    width        : '100%',
    height       : 'calc( 100% - ' + shape.topbar.height + ' )',
    display      : 'flex',
    flexDirection: 'column',
  }

})

const getCssPC = ({pallete, shape}) => ({

  appCss: {
    overflow     : 'hidden',
    background   : pallete.background[0],
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
    transition     : 'all .3s',
    background     : pallete.background[1],
    width          : 'calc( 100% - ' + shape.sidebar.width + ' )',
    transitionDelay: '.35s',
    display        : 'flex',
    flexDirection  : 'column',
  },

  closeContentCss: {
    minWidth : '100%',
    transform: 'translateX(-' + shape.sidebar.width + ')',
  }

})

function ScrollStyle() {

  const {pallete} = useTheme()
  const isSelected = !!useSelectedPhoto()
  const active = useActiveMenu()
  const isEnable = (active === 'gallery') && !isSelected

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      ::-webkit-scrollbar-track{
        background: ${pallete.background[1]}55;
        border: 0.8px solid ${pallete.background[1]}77;
      }
      ::-webkit-scrollbar-thumb{
        background: ${pallete.text[2]};
        border-radius: 10px;
        border: 1.5px solid ${pallete.background[0]}bb;
      }
      ::-webkit-scrollbar{
        transition : all .6s;
        height: ${isEnable ? '10px' : '0px'};
        width: 12px;
      }
    `
    }}>
    </style>
  )
}