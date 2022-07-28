import {useState, useEffect} from 'react'

const INTERVAL = 1000

export default function useNowDate () {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return now
}