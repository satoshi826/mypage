
import {atom, useRecoilValue} from 'recoil'
import pallete from './palette'
import shape from './shape'

const themeState = atom({
  key    : 'theme',
  default: {
    pallete: pallete(),
    shape  : shape(),
  },
})

export function useTheme() {
  const theme = useRecoilValue(themeState)
  return theme
}

export function useThemeCallback(func) {
  const theme = useRecoilValue(themeState)
  return func(theme)
}
