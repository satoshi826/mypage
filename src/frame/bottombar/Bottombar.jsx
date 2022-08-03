import {useThemeCallback} from '../../theme/useTheme'
// import Typography from '../../component/Typography'

export default function Bottombar() {

  const bottombarCss = useThemeCallback(getCss)

  return (
    <div css={bottombarCss}>
      {/* <Typography>
        this is bottom
      </Typography> */}
    </div>
  )
}

const getCss = ({pallete, shape}) => ({
  backgroundColor: pallete.background[0],
  borderTop      : '1px solid ' + pallete.background[2],
  height         : shape.topbar.height,
  display        : 'flex',
  alignItems     : 'center',
})