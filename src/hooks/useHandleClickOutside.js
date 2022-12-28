import {useRef, useEffect} from 'react'

export default function useHandleClickOutside(handler) {

  const containerRef = useRef()

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      handler()
    }
  }

  return containerRef

}

