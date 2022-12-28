import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useTheme} from '../../theme/useTheme'
import MenuGallery from './MenuGallery'
import MenuAbout from './MenuAbout'
import MenuTop from './MenuTop'

const activeMenuState = atom({
  key    : 'activeMenuState',
  default: null,
})

const isActiveMenuState = atom({
  key    : 'isActiveMenuState',
  default: false,
})

const useActiveMenu = () => useRecoilValue(activeMenuState)
export const useIsActiveMenu = () => useRecoilValue(isActiveMenuState)

export const useSetActiveMenu = () => useSetRecoilState(activeMenuState)

export const useDisactivateMenu = () => {
  const setterIsActive = useSetRecoilState(isActiveMenuState)
  return(() => {
    setterIsActive(false)
  })
}

export const useActivateMenu = () => {
  const setterIsActive = useSetRecoilState(isActiveMenuState)
  return(() => {
    setterIsActive(true)
  })
}

const menuMap = {
  top    : MenuTop,
  gallery: MenuGallery,
  about  : MenuAbout,
}

export default function Bottombar() {

  const {pallete, shape} = useTheme()
  const bottombarCss = getBarCss(pallete, shape)

  const activeMenu = useActiveMenu()
  const isActive = useIsActiveMenu()

  const Menu = menuMap?.[activeMenu]

  const menuCss = getMenuCss(isActive, shape)

  return (
    <div css={bottombarCss}>
      {Menu &&
      <div css={menuCss}>
        <Menu/>
      </div>
      }
    </div>
  )
}

const getBarCss = ({background}, {topbar}) => ({
  minHeight      : topbar.height,
  backgroundColor: background[0],
  borderTop      : '1px solid ' + background[2],
  alignItems     : 'center',
  justifyContent : 'center',
})

const getMenuCss = (isActive, {bottombar}) => ({
  height        : '100%',
  width         : '100%',
  transition    : 'all .4s',
  opacity       : !isActive && 0,
  transform     : !isActive && `translateY(${bottombar.height})`,
  display       : 'flex',
  position      : 'relative',
  alignItems    : 'center',
  justifyContent: 'center',
})