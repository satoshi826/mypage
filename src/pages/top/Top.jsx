import {useEffect} from 'react'
import {OrbitControls} from '@react-three/drei'
import {useIsTransition, useDoneTransition} from '../../hooks/usePageTransition'
// import {usePageTransition} from '../../hooks/usePageTransition'
// import Typography from '../../component/Typography'

export default function Top() {

  const isTransition = useIsTransition()

  const Done = () => {
    const doneTransition = useDoneTransition()
    useEffect(() => {
      doneTransition()
    }, [])
  }

  return (
    <>
      <OrbitControls />
      {isTransition && <Done/>}
    </>
  )
}
