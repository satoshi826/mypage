import {useIsOpenSidebar, useIsOpenSidebarValue} from '../useSidebar'
import {useTheme} from '../../theme/useTheme'
import {useIsMobile} from '../../hooks/useIsMobile'

export default function MenuButton() {

  const [isOpen, setIsOpen] = useIsOpenSidebar()
  const {pallete} = useTheme()
  const isMobile = useIsMobile()

  return (
    <div onClick={() => setIsOpen((v) => !v)} css={getLineCss(pallete, isOpen, isMobile)}>
      {isMobile ? <MenuIconMobile/> : <MenuIconPc/>}
    </div>
  )
}

const getLineCss = ({primary, text}, isOpen, isMobile) => ({
  cursor     : 'pointer',
  transition : 'all .6s',
  stroke     : (isMobile && isOpen) ? primary[0] : text[1],
  strokeWidth: '2px',
  '&:hover'  : {
    stroke: primary[0],
  },
  userSelect             : 'none',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)'
})

const MenuIconMobile = () => {

  const isOpen = useIsOpenSidebarValue()

  const base = [
    'M 20 25 l -20 0',
    'M 40 25 l -20 0',
    'M 0 35 h 40',
    'M 20 45 l -20 0',
    'M 40 45 l -20 0'
  ]

  const toClose = [
    'M 20 25 l -15 10',
    'M 40 25 l -15 10',
    'M 0 35 h 0',
    'M 20 45 l -15 -10',
    'M 40 45 l -15 -10',
  ]

  return (
    <svg
      key={isOpen ? 'open' : 'closed'}
      width={40}
      height={60}
    >
      {base.map((_, index) => {
        return (
          <path d={isOpen ? toClose[index] : base[index]} fill="transparent" css={{pointerEvents: 'none'}} key={index + 'path'} >
            <animate
              attributeName="d"
              from={isOpen ? base[index] : toClose[index] }
              to={isOpen ? toClose[index] : base[index]}
              dur="0.2s"
              begin="0s"
              fill="freeze"/>
          </path>
        )
      })}
    </svg>
  )
}


const MenuIconPc = () => {

  const isOpen = useIsOpenSidebarValue()

  const base = [
    'M 20 25 l -20 0',
    'M 40 25 l -20 0',
    isOpen ? 'M 40 35 h -40' : 'M 0 35 h 40',
    'M 20 45 l -20 0',
    'M 40 45 l -20 0'
  ]

  const toClose = [
    'M 20 25 l -15 10',
    'M 40 25 l -15 10',
    'M 5 35 h 0',
    'M 20 45 l -15 -10',
    'M 40 45 l -15 -10',
  ]

  const toOpen = [
    'M 20 35 l -15 -10',
    'M 40 35 l -15 -10',
    'M 40 35 h 0',
    'M 20 35 l -15 10',
    'M 40 35 l -15 10'
  ]

  const id = 'menu'

  return (
    <svg
      id={id}
      width={40}
      height={60}
    >
      {base.map((_, index) => {
        return (
          <path d={base[index]} fill="transparent" css={{pointerEvents: 'none'}} key={index + 'path'} >
            <animate
              attributeName="d"
              from={base[index]}
              to={isOpen ? toClose[index] : toOpen[index]}
              dur="0.2s"
              begin={id + '.mouseover'}
              fill="freeze"/>
            <animate
              attributeName="d"
              from={isOpen ? toClose[index] : toOpen[index]}
              to={base[index]}
              dur="0.2s"
              begin={id + '.mouseout'}
              fill="freeze"/>
            <animate
              attributeName="d"
              from={isOpen ? toOpen[index] : toClose[index]}
              to={isOpen ? toClose[index] : toOpen[index]}
              dur="0.2s"
              begin={id + '.click'}
              fill="freeze"/>
          </path>
        )
      })}
    </svg>
  )
}
