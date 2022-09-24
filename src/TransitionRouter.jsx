import {lazy, Suspense, createElement, useLayoutEffect} from 'react'
import {useCurrentPage, useIsTransition, useDoneTransition} from './hooks/usePageTransition'

const Top = lazy(() => import('./pages/top/Top'))
const Gallery = lazy(() => import('./pages/gallery/Gallery'))

const pageMap = {
  '/top'    : Top,
  '/gallery': Gallery
}

export default function TransitionRouter() {

  const currentPage = useCurrentPage()
  const pageElement = pageMap?.[currentPage] ?? _404

  return (
    <Suspense fallback={null}>
      {createElement(pageElement)}
    </Suspense>
  )
}

function _404() {

  const isTransition = useIsTransition()

  const Done = () => {
    const doneTransition = useDoneTransition()
    useLayoutEffect(() => {
      doneTransition()
    }, [])
  }

  return isTransition && <Done/>
}