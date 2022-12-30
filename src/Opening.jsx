import {useState, useEffect} from 'react'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useTheme} from './theme/useTheme'
import {useResetLight} from './mesh/MainLight'

const isOpeningState = atom({
  key    : 'isOpeningState',
  default: true, //{id, position, rotation}
})

const useSetIsOpening = () => useSetRecoilState(isOpeningState)
export const useIsOpening = () => useRecoilValue(isOpeningState)

export function Opening() {

  const setIsOpening = useSetIsOpening()
  const isOpening = useIsOpening()
  const resetLight = useResetLight()

  const [isStart, setIsStart] = useState(false)

  useEffect(() => {
    setIsStart(true)
    setTimeout(() => resetLight(), 1800)
    setTimeout(() => setIsOpening(false), 3200)
  }, [])

  const {shape} = useTheme()
  const openingCss = getOpeningCss(shape, isStart)
  const shutterCss = getShutterCss(isStart)

  return isOpening &&
    <div css={openingCss}>
      <div css={shutterCss}/>
    </div>
}

const getOpeningCss = ({topbar}, isStart) => ({
  position       : 'absolute',
  transition     : 'all 0.2s 1.8s',
  height         : `calc(100% - ${topbar.height})`,
  display        : 'flex',
  flexDirection  : 'column',
  justifyContent : 'center',
  alingItems     : 'center',
  width          : '100%',
  backgroundColor: '#000',
  zIndex         : 1,
  opacity        : isStart ? 0 : 1,
})

const getShutterCss = (isStart) => ({
  transition     : 'width 1s, height .6s 1.1s',
  width          : isStart ? '100%' : '0%',
  height         : isStart ? '100%' : '2px',
  backgroundColor: '#fff',
  zIndex         : 3,
})