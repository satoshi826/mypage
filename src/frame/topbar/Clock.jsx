import useNowDate from '../../hooks/useNowDate'

export default function Clock() {
  const now = useNowDate()
  return (
    <button >
      {now.toISOString()}
    </button>
  )
}