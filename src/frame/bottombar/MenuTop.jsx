import {useState, useRef, useCallback, useEffect} from 'react'
import {useIsMobile} from '../../hooks/useIsMobile'
import useHandleClickOutside from '../../hooks/useHandleClickOutside'
import {useCurrentPage} from '../../hooks/usePageTransition'
import {useSetLightSpeed} from '../../pages/top/LightController'
import {useTextState} from '../../pages/top/Text3D'
import {useSetLight} from '../../mesh/MainLight'
import {useTheme} from '../../theme/useTheme'
import {rgbaFromHEX} from '../../util'

export default function MenuTop() {

  const page = useCurrentPage()
  const isTop = page === '/top'

  const {pallete, shape} = useTheme()
  const isMobile = useIsMobile()

  const baseButtonprops = {
    pallete,
    isMobile,
    isTop
  }

  const barCss = getBarCss(shape, isTop)

  return (
    <div css={barCss}>
      <LightButton {...baseButtonprops}/>
      <TextButton {...baseButtonprops}/>
      <SpeedButton {...baseButtonprops}/>
    </div>
  )
}

const getBarCss = ({bottombar}, isTop) => ({
  position       : 'absolute',
  transition     : 'all .4s',
  transitionDelay: 'transform .5s',
  transform      : !isTop && `translateY(${bottombar.height})`,
  height         : bottombar.height,
  display        : 'flex',
  alignContent   : 'start',
  justifyContent : 'space-between',
  width          : 'min(600px, 100%)',
  padding        : '0px 40px'
})


//----------------------------------------------------------------

function LightButton({pallete, isMobile, isTop}) {

  const setLight = useSetLight()
  const [timerID, setTimerID] = useState('')
  const [lightLevel, setLightLevel] = useState(5)
  const [isActive, setIsActive] = useState(false)

  const onClickButton = () => setIsActive(pre => !pre)
  const onClickOutside = () => {
    setIsActive(false)
  }
  const containerRef = useHandleClickOutside(onClickOutside)

  // useEffect(() => {
  //   ref.current.setCurrentTime(lightLevel / 10)
  // }, [])

  const onChangeLight = (e) => {
    const value = e.target.value
    setLightLevel(value)
    clearTimeout(timerID)
    setTimerID(setTimeout(() =>
      setLight(pre => ({...pre, intensity: value * 0.8, distance: Math.max(48 * value - 120, 100)}))
    , 100))
  }

  const sliderContainerCss = getSliderContainerCss(pallete, isActive, isTop)
  const lineCss = getLineCss(pallete, isMobile, isActive)

  const sliderProps = {
    isActive,
    pallete,
    onChange: onChangeLight
  }

  return (
    <div css={iconContainerCss} ref={containerRef}>
      <div css={sliderContainerCss}>
        {<Slider {...sliderProps}/>}
      </div>
      <div css={lineCss} onClick={onClickButton}>
        <LightIcon lightLevel={lightLevel}/>
      </div>
    </div>
  )
}

function LightIcon({lightLevel}) {

  const ref = useRef()
  const setRef = useCallback((node) => {
    if (node) {
      node.pauseAnimations()
      node.setCurrentTime(0.5)
    }
    ref.current = node
  }, [])

  useEffect(() => {
    ref.current.setCurrentTime(lightLevel / 10)
  }, [lightLevel])


  const w = 40
  const h = 60

  const getSparkles = (circleR, sparkleSize) => {

    const offsetSparkle = 4
    const offsetR = circleR + offsetSparkle
    const oneRoot2 = (1 / Math.sqrt(2)).toFixed(3)

    return (
      `M ${w / 2} ${h / 2 - offsetR} l 0 ${- sparkleSize}
      M ${w / 2} ${h / 2 + offsetR} l 0 ${sparkleSize}
      M ${(w / 2) - offsetR} ${h / 2} l ${-sparkleSize} 0
      M ${(w / 2) + offsetR} ${h / 2} l ${sparkleSize} 0
      M ${(w / 2) + offsetR * oneRoot2} ${(h / 2) - offsetR * oneRoot2} l ${sparkleSize * oneRoot2} ${-sparkleSize * oneRoot2}
      M ${(w / 2) + offsetR * oneRoot2} ${(h / 2) + offsetR * oneRoot2} l ${sparkleSize * oneRoot2} ${sparkleSize * oneRoot2}
      M ${(w / 2) - offsetR * oneRoot2} ${(h / 2) + offsetR * oneRoot2} l ${-sparkleSize * oneRoot2} ${sparkleSize * oneRoot2}
      M ${(w / 2) - offsetR * oneRoot2} ${(h / 2) - offsetR * oneRoot2} l ${-sparkleSize * oneRoot2} ${-sparkleSize * oneRoot2}`
    )
  }

  const getCircle = (circleR) => {
    return `M ${w / 2},${h / 2 + circleR} A ${circleR} ${circleR} 0 1 0 ${w / 2 - 0.01},${60 / 2 + circleR} z`
  }

  const sparkles = [[5, 3], [9, 7]].map(([circleR, sparkleSize]) => getSparkles(circleR, sparkleSize))
  const circle = [5, 9].map((circleR) => getCircle(circleR))

  return (
    <svg
      width={w}
      height={h}
      ref={setRef}
    >
      <path d={circle[0]} fill="transparent">
        <animate attributeName="d" to={circle[1]} dur="1s" fill="freeze"/>
      </path>
      <path d={sparkles[0]} fill="transparent" >
        <animate attributeName="d" to={sparkles[1]} dur="1s" fill="freeze"/>
      </path>
    </svg>
  )
}


//----------------------------------------------------------------

function SpeedButton({pallete, isMobile, isTop}) {

  const [timerID, setTimerID] = useState('')
  const [speedLevel, setSpeedLevel] = useState(5)
  const [isActive, setIsActive] = useState(false)

  const setLightSpeed = useSetLightSpeed()

  const onClickButton = () => setIsActive(pre => !pre)
  const onClickOutside = () => {
    setIsActive(false)
  }

  const containerRef = useHandleClickOutside(onClickOutside)

  const onChangeLight = (e) => {
    const value = e.target.value
    setSpeedLevel(value)
    clearTimeout(timerID)
    setTimerID(setTimeout(() =>
      setLightSpeed(value)
    , 100))
  }

  const sliderContainerCss = getSliderContainerCss(pallete, isActive, isTop)
  const lineCss = getLineCss(pallete, isMobile, isActive)

  const sliderProps = {
    isActive,
    pallete,
    onChange: onChangeLight
  }

  return (
    <div css={iconContainerCss} ref={containerRef}>
      <div css={sliderContainerCss}>
        <Slider {...sliderProps}/>
      </div>
      <div css={lineCss} onClick={onClickButton}>
        <SpeedIcon speedLevel={speedLevel}/>
      </div>
    </div>
  )
}

function SpeedIcon({speedLevel}) {

  const ref = useRef()
  const setRef = useCallback((node) => {
    if (node) {
      node.pauseAnimations()
      node.setCurrentTime(0.5)
    }
    ref.current = node
  }, [])

  useEffect(() => {
    ref.current.setCurrentTime(speedLevel / 10)
  }, [speedLevel])

  const w = 40
  const h = 60

  const circleR = 8

  const getTracks = (center) => {
    return (
      `
      M ${8 + center} ${h / 2 - 5} l -${2 * center} 0
      M ${8 + center} ${h / 2} l -${2 * center} 0
      M ${8 + center} ${h / 2 + 5} l -${2 * center} 0
      `
    )
  }

  const getCircle = (center) => {
    return `M ${w / 2 + center},${h / 2 + circleR} A ${circleR} ${circleR} 0 1 0 ${w / 2 - 0.01 + center},${60 / 2 + circleR} z`
  }

  const tracks = [0, 10].map((center) => getTracks(center))
  const circle = [0, 10].map((center) => getCircle(center))

  return (
    <svg
      width={w}
      height={h}
      ref={setRef}
    >
      <path d={circle[0]} fill="transparent">
        <animate attributeName="d" to={circle[1]} dur="1s" fill="freeze"/>
      </path>
      <path d={tracks[0]} fill="transparent" >
        <animate attributeName="d" to={tracks[1]} dur="1s" fill="freeze"/>
      </path>
    </svg>
  )
}

//----------------------------------------------------------------

function TextButton({pallete, isMobile, isTop}) {

  const [timerID, setTimerID] = useState('')
  const [text, setText] = useTextState()
  const [textTmp, setTextTmp] = useState(text)
  const [isActive, setIsActive] = useState(false)

  const onClickButton = () => setIsActive(pre => !pre)
  const onClickOutside = () => {
    setIsActive(false)
  }

  const containerRef = useHandleClickOutside(onClickOutside)

  const onChangeText = (e) => {
    const value = e.target.value.replace(/[^0-9a-z]/gi, '')
    if(value.length > 10) return
    clearTimeout(timerID)
    setTextTmp(value)
    setTimerID(setTimeout(() => {
      setText(value)
    }
    , 500))
  }

  const inputContainerCss = getInputContainerCss(pallete, isActive, isTop)
  const lineCss = getLineCss(pallete, isMobile, isActive)

  const inputProps = {
    text    : textTmp,
    isActive,
    pallete,
    onChange: onChangeText,
  }

  return (
    <div css={textIconContainerCss} ref={containerRef}>
      <div css={inputContainerCss}>
        <Input {...inputProps}/>
      </div>
      <div css={lineCss} onClick={onClickButton}>
        <TextIcon text={textTmp}/>
      </div>
    </div>
  )
}

function TextIcon({text}) {

  const [first, secound] = [...text]

  return (
    <div css={textIcon}>
      <span css={firstTextCss}>
        {first}
      </span>
      <span css={SecoundTextCss}>
        {secound}
      </span>
    </div>
  )
}

const textIcon = {
  display       : 'flex',
  height        : '60px',
  alignItems    : 'center',
  justifyContent: 'center',
}

const firstTextCss = {
  paddingTop: '2px',
  fontSize  : '32px'
}

const SecoundTextCss = {
  paddingTop: '10px',
  fontSize  : '20px'
}

const textIconContainerCss = {
  transition    : 'all .4s',
  zIndex        : 100002,
  display       : 'flex',
  alignItems    : 'center',
  justifyContent: 'center',
  position      : 'relative',
  alignContent  : 'start',
  width         : '260px',
}

const getInputContainerCss = ({primary, background}, isActive, isTop) => ({
  transition    : 'all .4s',
  position      : 'absolute',
  display       : 'flex',
  alignItems    : 'center',
  justifyContent: 'space-around',
  padding       : isActive && '12px 0px',
  flexDirection : 'column',
  width         : '260px',
  height        : isActive ? '120px' : '0px',
  top           : isActive ? '-120px' : '0px',
  background    : rgbaFromHEX(background[1], 0.4),
  backdropFilter: 'blur(5px)',
  border        : '1px solid ' + isActive ? rgbaFromHEX(background[2], 0.2) : 'rgba(0,0,0,0)',
  '&::after'    : isTop && {
    transition  : 'all .4s',
    content     : '""',
    position    : 'absolute',
    top         : '-2px',
    height      : '4px',
    borderRadius: '8px',
    width       : isActive ? '260px' : '60px',
    background  : primary[0],
    boxShadow   : `
    0 0 2px 0px  ${primary[0]},
    0 0 8px 0px  ${primary[1]},
    0 0 16px 0px  ${primary[2]},
    0 0 24px 0px  ${primary[2]}
    `
  }
})

function Input({isActive, pallete, onChange, text}) {
  const inputCss = getInputCss(isActive, pallete)
  const anotationCss = getAnnotationCss(isActive, pallete)
  return (
    <>
      <div css={anotationCss}>input [0-9, a-z, A-Z]</div>
      <input css={inputCss} value={text} onChange={onChange} disabled={!isActive}/>
    </>
  )
}

const getAnnotationCss = (isActive, {text}) => ({
  transition   : 'all .3s',
  color        : isActive ? text[2] : 'rgba(0,0,0,0)',
  fontSize     : '22px',
  fontFamily   : 'Mplus',
  pointerEvents: 'none',
  userSelect   : 'none',
})

const getInputCss = (isActive, {text, primary}) => ({
  zIndex         : 100002,
  border         : 'none',
  position       : 'relative',
  transitionDelay: '2s',
  transition     : 'all .3s',
  imeMode        : 'disabled',
  background     : isActive ? rgbaFromHEX(text[0], 0.08) : 'rgba(0,0,0,0)',
  width          : isActive ? '80%' : '0%',
  borderBottom   : isActive && '1px solid ' + text[2],
  boxShadow      : 'none',
  textAlign      : 'center',
  fontSize       : '28px',
  fontFamily     : 'Mplus',
  color          : isActive ? text[0] : 'rgba(0,0,0,0)',
  ':focus'       : {
    outline     : 'none',
    borderBottom: '1px solid ' + primary[0],
    boxShadow   : '0px 1px ' + primary[0],
  }
})

//----------------------------------------------------------------

const iconContainerCss = {
  zIndex      : 100002,
  transition  : 'all .4s',
  position    : 'relative',
  alignItems  : 'center',
  alignContent: 'start',
  width       : '60px',
}

const getSliderContainerCss = ({primary, background}, isActive, isTop) => ({
  transition    : 'all .4s',
  position      : 'absolute',
  display       : 'flex',
  alignItems    : 'center',
  justifyContent: 'center',
  width         : '60px',
  height        : isActive ? '200px' : '0px',
  top           : isActive ? '-200px' : '0px',
  background    : rgbaFromHEX(background[1], 0.4),
  backdropFilter: 'blur(5px)',
  border        : '1px solid ' + rgbaFromHEX(background[2], 0.2),
  '&::after'    : isTop && {
    content     : '""',
    position    : 'absolute',
    top         : '-2px',
    height      : '4px',
    borderRadius: '8px',
    width       : '60px',
    background  : primary[0],
    boxShadow   : `
    0 0 2px 0px  ${primary[0]},
    0 0 8px 0px  ${primary[1]},
    0 0 16px 0px  ${primary[2]},
    0 0 24px 0px  ${primary[2]}
    `
  }
})

const getLineCss = ({primary, text}, isMobile, isActive) => ({
  display       : 'flex',
  width         : '60px',
  justifyContent: 'center',
  transition    : 'all .4s',
  fontFamily    : 'F18',
  cursor        : 'pointer',
  color         : isActive ? primary[0] : text[1],
  stroke        : isActive ? primary[0] : text[1],
  strokeWidth   : '2px',
  '&:hover'     : !isMobile && {
    strokeWidth: '4px',
    textShadow : '0px 0px 6px ' + (isActive ? primary[0] : text[0])
  },
  userSelect             : 'none',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
})


function Slider({isActive, pallete, onChange}) {
  const slideCss = getSlideCss(isActive, pallete)
  return <input onChange={onChange} css={slideCss} max="10" min="0" type="range" step={0.2} />
}

const getSlideCss = (isActive, {primary, text}) => ({
  appearence      : 'none',
  WebkitAppearance: 'none',
  cursor          : 'pointer',
  outline         : 0,
  borderRadius    : '16px',
  boxShadow       : 'inset 0 0 3px #000',
  background      : rgbaFromHEX(text[1], 0.1),
  transition      : 'all .4s',
  transform       : 'rotate(-0.25turn)',
  opacity         : isActive ? 1 : 0,
  minWidth        : isActive ? '160px' : '0px',
  maxWidth        : isActive ? '160px' : '0px',
  height          : '14px',
  overflow        : 'hidden',

  '::-webkit-slider-thumb': {
    WebkitAppearance: 'none',
    width           : '14px',
    height          : '14px',
    borderRadius    : '50%',
    background      : '#fff',
    boxShadow       : `
    -208px 0 0 200px ${primary[0]}
    `,
  },

})