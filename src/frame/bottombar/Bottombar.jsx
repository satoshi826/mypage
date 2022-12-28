import {useThemeCallback} from '../../theme/useTheme'
import MenuGallery from './MenuGallery'
import MenuAbout from './MenuAbout'
import MenuTop from './MenuTop'

export default function Bottombar() {

  const bottombarCss = useThemeCallback(getCss)

  return (
    <div css={bottombarCss}>
      <MenuGallery/>
      <MenuAbout/>
      <MenuTop/>
    </div>
  )
}

const getCss = ({pallete, shape}) => ({
  minHeight      : shape.topbar.height,
  backgroundColor: pallete.background[0],
  borderTop      : '1px solid ' + pallete.background[2],
  display        : 'flex',
  position       : 'relative',
  alignItems     : 'center',
  justifyContent : 'center',
})