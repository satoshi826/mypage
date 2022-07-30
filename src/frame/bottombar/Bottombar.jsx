import {useThemeCallback} from '../../theme/useTheme'

export default function Bottombar() {

  const bottombarCss = useThemeCallback(getCss)

  return (
    <div css={bottombarCss}>
      {/* <Clock/> */}
    </div>
  )
}

const getCss = ({pallete, shape}) => ({
  backgroundColor: pallete.background[1],
  maxHeight      : shape.bottombar.height,
  minHeight      : shape.bottombar.height,
  flexGrow       : 1,
  display        : 'flex',
  alignItems     : 'center',
})