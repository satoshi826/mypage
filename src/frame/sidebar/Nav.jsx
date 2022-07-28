import {Link, useLocation} from 'wouter'
import {useThemeCallback} from '../../theme/useTheme'

export default function Nav({url, name}) {
  const [location] = useLocation()
  const isActive = location === url

  const {baseCss, activeCss, passiveCss} = useThemeCallback(getCss)

  return (
    <Link href={url} >
      <nav css={{position: 'relative'}}>
        <div css={isActive ? [baseCss, activeCss] : [baseCss, passiveCss]}>
          {name}
        </div>
      </nav>
    </Link>
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
      height    : '2px'
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