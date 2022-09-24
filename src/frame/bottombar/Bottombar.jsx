import {useThemeCallback} from '../../theme/useTheme'
import BackButton from './BackButton'

export default function Bottombar() {

  const bottombarCss = useThemeCallback(getCss)

  return (
    <div css={bottombarCss}>
      <BackButton/>
    </div>
  )
}

const getCss = ({pallete, shape}) => ({
  height         : shape.topbar.height,
  backgroundColor: pallete.background[0],
  borderTop      : '1px solid ' + pallete.background[2],
  display        : 'flex',
  alignItems     : 'center',
  justifyContent : 'center',
})