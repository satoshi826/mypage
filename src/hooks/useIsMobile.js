import {useState, useEffect} from 'react'

const mediaQuery = window.matchMedia('(max-width: 768px)')

export default function useIsMobile() {

  const [isMoblie, setIsMoblie] = useState(mediaQuery.matches)

  const handle = ({matches}) => {
    setIsMoblie(matches)
  }

  useEffect(() => {
    mediaQuery.addEventListener('change', handle)
    return () => {
      mediaQuery.removeEventListener('change', handle)
    }
  })

  return isMoblie
}