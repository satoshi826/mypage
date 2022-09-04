import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useEffect} from 'react'

const mediaQuery = window.matchMedia('(max-width: 768px)')

const isMoblieState = atom({
  key    : 'isMoblieState',
  default: mediaQuery.matches
})

export function useIsMobileListener() {

  const setIsMoblie = useSetRecoilState(isMoblieState)

  const handle = ({matches}) => {
    setIsMoblie(matches)
  }

  useEffect(() => {
    mediaQuery.addEventListener('change', handle)
    return () => {
      mediaQuery.removeEventListener('change', handle)
    }
  })

  return null
}

export function useIsMobile() {
  return useRecoilValue(isMoblieState)
}