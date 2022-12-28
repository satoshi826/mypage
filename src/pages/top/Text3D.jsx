import {Suspense, lazy} from 'react'
import {useRecoilState, atom} from 'recoil'
const TextMesh = lazy(() => import('./TextMesh'))

const textState = atom({
  key    : 'textState',
  default: 'mu'
})

export function useTextState() {
  return useRecoilState(textState)
}

export default function Text3D() {

  const [text] = useRecoilState(textState)
  return (
    <Suspense fallback={null}>
      <TextMesh>
        {text}
      </TextMesh>
    </Suspense>
  )
}
