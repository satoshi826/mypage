import {useTheme} from '../theme/useTheme'

export default function Typography(props) {
  const {color = 'text', intensity = '0'} = props
  const {pallete} = useTheme()
  let css = props.css ?? {}

  css.color = pallete[color][intensity]
  css.fontSize = props.fontSize
  css.overFlowWrap = 'break-word'
  css.wordBreak = 'break-all'

  return (
    <div
      {...props}
      css={css}
    />
  )
}
