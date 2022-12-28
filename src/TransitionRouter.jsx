import {useEffect} from 'react'
import {useCurrentPage, useIsTransition, useDoneTransition} from './hooks/usePageTransition'

import Top from './pages/top/Top'
import Gallery from './pages/gallery/Gallery'
import About from './pages/about/About'

const pageMap = {
  '/top'    : <Top />,
  '/gallery': <Gallery />,
  '/about'  : <About />,
}


export default function TransitionRouter() {

  const currentPage = useCurrentPage()
  const pageElement = pageMap?.[currentPage] ?? _404

  return pageElement
}

function _404() {

  const isTransition = useIsTransition()

  const Done = () => {
    const doneTransition = useDoneTransition()
    useEffect(() => {
      doneTransition()
    }, [])
  }

  return isTransition && <Done/>
}