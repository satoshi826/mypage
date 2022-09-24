
import {useEffect} from 'react'

export default function AutoScroller() {

  useEffect(() => {
    const timer = setInterval(() => {
      document.getElementById('scroll-controller').scrollBy(window.innerWidth / 150, 0)
    }, 25)
    return () => clearInterval(timer)
  }, [])

  return null
}
