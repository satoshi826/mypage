import {useEffect} from 'react'
import {useCurrentPage, useSetCurrentPage} from './hooks/usePageTransition'
import {useIsOpening} from './Opening'
import {useLocation} from 'wouter'

import Top from './pages/top/Top'
import Gallery from './pages/gallery/Gallery'
import About from './pages/about/About'

const pageMap = {
  '/top'    : <Top />,
  '/gallery': <Gallery />,
  '/about'  : <About />,
}


export default function TransitionRouter() {
  const isOpening = useIsOpening()
  const currentPage = useCurrentPage()
  const pageElement = pageMap?.[currentPage] ?? <Root/>
  return !isOpening && pageElement
}

function Root() {

  const setLocation = useLocation()[1]
  const setCurrentPage = useSetCurrentPage()

  useEffect(() => {
    setLocation('/top')
    setCurrentPage('/top')
  }, [])

}