import {Link, useLocation} from 'wouter'
import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useIsOpenSidebar} from '../useSidebar'
import {useIsActiveMenu} from '../bottombar/Bottombar'

export default function Nav({url, name}) {
  const [location] = useLocation()
  const isActive = location === url
  const isMobile = useIsMobile()
  const isActiveMenu = useIsActiveMenu()
  const {pallete} = useTheme()
  const setIsOpen = useIsOpenSidebar()[1]
  const {baseCss, activeCss, passiveCss} = getCss(pallete)

  return (
    <nav css={[{position: 'relative'}, !isActiveMenu && {pointerEvents: 'none'}]} onClick={() => isMobile && setIsOpen(false)}>
      <Link href={url} >
        <div
          css={[baseCss, isActive ? activeCss : passiveCss]}>
          {name}
        </div>
      </Link>
    </nav>
  )
}

const getCss = ({text, primary}) => ({

  baseCss: {
    cursor                 : 'pointer',
    color                  : text[0],
    userSelect             : 'none',
    padding                : '15px 15px',
    fontFamily             : 'F18',
    fontSize               : '2.2rem',
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    '&::after'             : {
      content : '""',
      position: 'absolute',
      bottom  : '8px',
      left    : '0px',
      right   : '0px',
      height  : '2px',
      width   : '0%'
    }
  },

  activeCss: {
    '&::after': {
      background: primary[0],
      transition: 'all .25s',
      width     : '100%',
      boxShadow : `
      0 0 2px 0px  ${primary[0]},
      0 0 8px 0px  ${primary[1]},
      0 0 16px 0px  ${primary[2]},
      0 0 24px 0px  ${primary[2]}
      `
    },
  },

  passiveCss: {
    '&::after': {
      background: text[0],
      transition: 'all .4s'
    },
    '&:hover::after': {
      width: '75%'
    },
  }

})