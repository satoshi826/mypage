
import {atom, useRecoilValue, useSetRecoilState} from 'recoil'
import {useLocation} from 'wouter'

const currentPageState = atom({
  key    : 'currentPageState',
  default: location.pathname
})

export function useCurrentPage() {
  return useRecoilValue(currentPageState)
}

export function useCurrentLocation() {
  const [location] = useLocation()
  return location
}

export function useIsTransition() {
  const location = useCurrentLocation()
  const currentPage = useCurrentPage()
  return (location !== currentPage)
}

export function useDoneTransition() {
  const [location] = useLocation()
  const setCurrentPage = useSetRecoilState(currentPageState)
  return () => setCurrentPage(location)
}