import {Link, useLocation} from 'wouter'
import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'
import {useIsTransition} from '../../hooks/usePageTransition'
import {useIsOpenSidebar} from '../useSidebar'

export default function Nav({url, name}) {
  const [location] = useLocation()
  const isActive = location === url
  const isMobile = useIsMobile()
  const isTransition = useIsTransition()
  const {pallete} = useTheme()
  const setIsOpen = useIsOpenSidebar()[1]
  const {baseCss, activeCss, passiveCss} = getCss({pallete})

  return (
    <nav css={[{position: 'relative'}, isTransition && {pointerEvents: 'none'}]} onClick={() => isMobile && setIsOpen(false)}>
      <Link href={url} >
        <div
          css={[baseCss, isActive ? activeCss : passiveCss]}>
          {name}
        </div>
      </Link>
    </nav>
  )
}

const getCss = ({pallete}) => ({

  baseCss: {
    '&:hover': {
      cursor: 'pointer'
    },
    color     : pallete.text[0],
    userSelect: 'none',
    padding   : '15px 15px',
    fontFamily: 'F18',
    fontSize  : '2rem',
    '&::after': {
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
      background: pallete.primary[0],
      transition: 'all .25s',
      width     : '100%',
    },
  },

  passiveCss: {
    '&::after': {
      background: pallete.text[0],
      transition: 'all .4s'
    },
    '&:hover::after': {
      width: '75%'
    },
  }

})