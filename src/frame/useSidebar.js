import {useRef} from 'react'
import {atom, useRecoilState, useRecoilValue} from 'recoil'
import {useTheme} from '../theme/useTheme'

const isOpenState = atom({
  key    : 'isOpenState',
  default: !window.matchMedia('(max-width: 768px)').matches,
})

const isSwipingState = atom({
  key    : 'isSwipingState',
  default: false,
})

const positionState = atom({
  key    : 'positionState',
  default: 0,
})

export function useIsOpenSidebar() {
  return useRecoilState(isOpenState)
}

export function useIsOpenSidebarValue() {
  return useRecoilValue(isOpenState)
}

export function useIsSwipingValue() {
  return useRecoilValue(isSwipingState)
}

export function usePositionValue() {
  return useRecoilValue(positionState)
}

export function useOpenSwipe() {

  const [isOpenSidebar, setIsOpenSidebar] = useIsOpenSidebar()
  const [isSwiping, setIsSwiping] = useRecoilState(isSwipingState)
  const setPosition = useRecoilState(positionState)[1]
  const touchHistory = useRef(new Array(5).fill(0))

  const width = parseInt(useTheme().shape.sidebar.width.slice(0, -2))

  if (isSwiping) return {
    onTouchMoveCapture: (e) => {
      const touchX = e.changedTouches[0].clientX
      setPosition(Math.min(touchX, width))
      const triggerOpen = (width / 3) < touchX
      if (!isOpenSidebar && triggerOpen) setIsOpenSidebar(true)
      if (isOpenSidebar && !triggerOpen) setIsOpenSidebar(false)
    },
    onTouchEnd: () => {
      setPosition()
      setIsSwiping(false)
    },
  }

  return {
    onTouchStart: () => {
      touchHistory.current = new Array(5).fill(0)
    },
    onTouchMoveCapture: (e) => {
      const touchX = e.changedTouches[0].clientX
      touchHistory.current.unshift(touchX)
      touchHistory.current.pop()
      const isEdge = touchHistory.current[4] < 80
      const isSwiping = touchHistory.current.every((touch, index) => touch > (touchHistory.current?.[index + 1] ?? 0))
      if (isEdge && isSwiping) setIsSwiping(true)
    }
  }
}

export function useCloseSwipe() {

  const [isOpenSidebar, setIsOpenSidebar] = useIsOpenSidebar()
  const setIsSwiping = useRecoilState(isSwipingState)[1]
  const setPosition = useRecoilState(positionState)[1]
  const start = useRef(null)
  const now = useRef(null)

  const width = parseInt(useTheme().shape.sidebar.width.slice(0, -2))

  return {
    onTouchMoveCapture: (e) => {
      setIsSwiping(true)
      const touchX = e.changedTouches[0].clientX
      if(!start.current) start.current = touchX
      now.current = touchX

      const position = width - (start.current - now.current)
      setPosition(Math.min(position, width))

      const triggerOpen = (2 * width / 3) < position
      if (!isOpenSidebar && triggerOpen) setIsOpenSidebar(true)
      if (isOpenSidebar && !triggerOpen) setIsOpenSidebar(false)

    },
    onTouchEnd: () => {
      start.current = null
      now.current = null
      setPosition(0)
      setIsSwiping(false)
    },
  }
}