/* eslint-disable no-irregular-whitespace */
import * as THREE from 'three'
import {useRef, Suspense, forwardRef} from 'react'
import {atom, useSetRecoilState, useRecoilValue} from 'recoil'
import {useFrame} from '@react-three/fiber'
import {useScroll, Text as Text2D} from '@react-three/drei'
import {useIsMobile} from '../../hooks/useIsMobile'

const damp = THREE.MathUtils.damp
const ROOM_HEIGHT = 75
const PADDING_BOTTOM = 3
const defaultZ = -25
const scrollPower = 0.01

const clamp = (value, min, max) => Math.max(Math.min(value, max), min)

const uniquify = (text) => {
  text = text.split('')
  text = text.filter(function (x, i, self) {
    return self.indexOf(x) === i
  })
  text = text.join(',')
  return text.replace(/,/g, '')
}

//----------------------------------------------------------------

const scrollStageState = atom({
  key    : 'scrollStageState',
  default: 0,
})

export const useSetScrollStage = () => useSetRecoilState(scrollStageState)
export const useScrollStage = () => useRecoilValue(scrollStageState)

//----------------------------------------------------------------

export default forwardRef(function Text(_, ref) {

  const scroll = useScroll()
  const currentScrollStage = useScrollStage()
  const setScrollStage = useSetScrollStage()

  const preScroll = useRef(0)

  useFrame(() => {
    const scrollValue = scroll.scroll.current * 1000

    if (scrollValue !== preScroll.current) {
      const scrollStage =
      (scrollValue < 80) ? 0 :
        (scrollValue < 430) ? 1 :
          (scrollValue < 760) ? 2 :
            3
      if (scrollStage !== currentScrollStage) setScrollStage(scrollStage)
      preScroll.current = scrollValue
    }
  })


  return (
    <Suspense fallback={null}>
      <group position={[0, -200, defaultZ]} ref={ref}>
        <ScrollText start={-60} fontSize={6} isFadeOut light={{intensity: 3, distance: 65}}>
        Scroll
        </ScrollText>
        <ScrollText start={-52} fontSize={10} isFadeOut>
        ⇩
        </ScrollText>
        <ScrollText start={0} fontSize={12} isFadeOut light={{intensity: 3, distance: 65}}>
        mu
        </ScrollText>
        <ScrollText start={20} fontSize={5} isFadeOut >
        Developer / Photographer
        </ScrollText>
        <ScrollText start={80} end={390} fontSize={11} isUnderlined light={{intensity: 2, distance: 65}}>
        Developer
        </ScrollText>
        <ScrollText start={110} fontSize={4}>
        メーカー勤めの2年目エンジニアです
        業務ではwebアプリ作ってます
        新しい技術に触れることが好きです
        </ScrollText>
        <ScrollText start={140} fontSize={8} light={{intensity: 2, distance: 65}}>
        Skill
        </ScrollText>
        <ScrollText start={160} fontSize={5}>
        JavaScript / CSS / HTML
        React / MUI / Recoil / swr
        Three.js  / r3f /  node.js
        AWS / Lambda / Dynamo
        Serverless Framework
        OpenAPI / Swagger
        </ScrollText>
        <ScrollText start={230} fontSize={8} light={{intensity: 2, distance: 65}}>
        Will
        </ScrollText>
        <ScrollText start={250} fontSize={4}>
        webGL / webRTC等、フロント側で
        リッチコンテンツを作る技術に
        興味があるので鍛えていきたいです
        </ScrollText>
        <ScrollText start={410} end={720} fontSize={11} isUnderlined light={{intensity: 2, distance: 65}}>
        Photographer
        </ScrollText>
        <ScrollText start={440} fontSize={4}>
        東京・神奈川で
        ストリートスナップを撮ってます
        良い光や構図を探してます
        </ScrollText>
        <ScrollText start={470} fontSize={8} light={{intensity: 2, distance: 65}}>
        Achievement
        </ScrollText>
        <ScrollText start={490} fontSize={6}>
        1X
        </ScrollText>
        <ScrollText start={500} fontSize={4}>
        67 Published
        </ScrollText>
        <ScrollText start={510} fontSize={6}>
        Interviewed
        </ScrollText>
        <ScrollText start={520} fontSize={4}>
        Photography Masterclass Magazine
        Issue 97
        </ScrollText>
        <ScrollText start={550} fontSize={8} light={{intensity: 2, distance: 65}}>
        Gear
        </ScrollText>
        <ScrollText start={570} fontSize={5}>
        α7ii
        </ScrollText>
        <ScrollText start={580} fontSize={5}>
        Apo-lanthar 50mm f2
        </ScrollText>
        <ScrollText start={590} fontSize={5}>
        COLOR-SKOPAR 21mm f4
        </ScrollText>
        <ScrollText start={740} end={1010} fontSize={11} isUnderlined light={{intensity: 2, distance: 65}}>
        Other
        </ScrollText>
        <ScrollText start={770} fontSize={8} light={{intensity: 2, distance: 65}}>
        this Page
        </ScrollText>
        <ScrollText start={790} fontSize={4}>
        実装動機は r3f / three.js の学習です
        スナップで習得した光や構図による表現を
        反映したら何が作れるか試してみました
        </ScrollText>
        <ScrollText start={830} fontSize={8} light={{intensity: 2, distance: 65}}>
        Link
        </ScrollText>
        <ScrollText start={850} fontSize={5.5} link={'https://twitter.com/stosto826'}>
        Twitter
        </ScrollText>
        <ScrollText start={862} fontSize={5.5} link={'https://500px.com/p/satoshi826?view=photos'}>
        500px
        </ScrollText>
        <ScrollText start={874} fontSize={5.5} link={'https://1x.com/satoshi826'}>
        1X
        </ScrollText>
        <ScrollText start={950} fontSize={8} light={{intensity: 2, distance: 70}}>
        To be continued...
        </ScrollText>
      </group>
    </Suspense>

  )
})

function ScrollText({children, start, end, fontSize, isFadeOut, isUnderlined, light, link}) {

  const isMobile = useIsMobile()
  const lambda = isMobile ? 8 : 4

  const scroll = useScroll()
  const textRef = useRef()
  const lineRef = useRef()
  const coverRef = useRef()
  const lightRef = useRef()

  useFrame((_, delta) => {
    const scrollValue = scroll.scroll.current * 1000

    const targetY = (!isUnderlined || scrollValue < start + 100)
      ? (PADDING_BOTTOM - ROOM_HEIGHT / 2) + ((scrollValue - start) * scrollPower) * ROOM_HEIGHT
      : ((scrollValue < end))
        ? (ROOM_HEIGHT / 2) + 3
        : 8

    if (textRef.current?._defaultMaterial) {
      textRef.current.position.y = damp(textRef.current.position.y, targetY, lambda, delta)
    }

    if (isFadeOut && textRef.current?._defaultMaterial?.opacity) {
      textRef.current._defaultMaterial.opacity = clamp(3 * ((ROOM_HEIGHT / 2) - textRef.current.position.y) / ROOM_HEIGHT, 0.001, 1)
    }

    if (light && lightRef.current) {
      lightRef.current.position.y = textRef.current.position.y - 5
      lightRef.current.position.z = textRef.current.position.z
    }

    if(isUnderlined && textRef.current) {
      const targetZ = (scrollValue > end + 40 && textRef.current.position.y < 10) ? - 2.5 * defaultZ : 0
      textRef.current.position.z = damp(textRef.current.position.z, targetZ, 2.5, delta)
      lineRef.current.position.y = textRef.current.position.y - 16
      coverRef.current.position.y = textRef.current.position.y - 16
      lineRef.current.position.z = textRef.current.position.z
      coverRef.current.position.z = textRef.current.position.z

      const lineScale = ((scrollValue < end - 8) && (lineRef.current.position.y > 0)) ? 1 : 0
      lineRef.current.scale.y = damp(lineRef.current.scale.y, lineScale, 10, delta)
    }
  })

  return (
    <Suspense fallback={null}>
      <Text2D
        ref={textRef}
        color={'#fff'}
        font='./font/mplus-1p-light.woff'
        fontSize={fontSize}
        maxWidth={68}
        position={[0, -50, 0]}
        renderOrder={isUnderlined ? -2 : 0}
        characters={uniquify(children)}
        sdfGlyphSize={32}
        textAlign="center"
        anchorY="top"
        onPointerEnter={link ? () => {
          textRef.current._defaultMaterial.opacity = 2
        } : null}
        onPointerOut={link ? () => {
          textRef.current._defaultMaterial.opacity = 1
        } : null}
        onClick={link ? () => {
          window.open(link, '_blank')
        } : null}
      >
        {children}
      </Text2D>
      {
        isUnderlined &&
        <>
          <mesh ref={lineRef} rotation={[0, 0, Math.PI / 2]} >
            <planeBufferGeometry args={[0.3, 75]} />
            <meshBasicMaterial color={'#eee'}/>
          </mesh>
          <mesh ref={coverRef} rotation={[Math.PI / 2, 0, Math.PI / 2]} renderOrder={-1}>
            <planeBufferGeometry args={[80, 70]} />
            <meshBasicMaterial transparent opacity={0} depthTest/>
          </mesh>
        </>
      }
      {
        (light) &&
        <Suspense fallback={null}>
          <pointLight ref={lightRef} {...{decay: 2, ...light}}/>
        </Suspense>
      }
    </Suspense>
  )
}