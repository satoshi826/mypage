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
  height         : shape.topbar.height,
  backgroundColor: pallete.background[3],
  display        : 'flex',
  alignItems     : 'center',
})