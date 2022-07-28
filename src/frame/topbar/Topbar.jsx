import {useThemeCallback} from '../../theme/useTheme'
import MenuButton from './MenuButton'
// import Clock from './Clock'

export default function Topbar() {

  const topbarCss = useThemeCallback(getCss)

  return (
    <div css={topbarCss}>
      <MenuButton/>
      {/* <Clock/> */}
    </div>
  )
}

const getCss = ({pallete, shape}) => ({
  backgroundColor: pallete.background[3],
  maxHeight      : shape.topbar.height,
  minHeight      : shape.topbar.height,
  display        : 'flex',
  alignItems     : 'center',
})