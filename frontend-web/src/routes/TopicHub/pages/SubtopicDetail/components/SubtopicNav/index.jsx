import { NavRow, NavButton, NavDirection, NavTitle } from './SubtopicNav.styles'

export default function SubtopicNav({ prevSubtopic, nextSubtopic, onNavigate }) {
  if (!prevSubtopic && !nextSubtopic) return null

  return (
    <NavRow>
      <NavButton onClick={() => prevSubtopic && onNavigate(prevSubtopic.slug)} disabled={!prevSubtopic} $align="left">
        <NavDirection>← Sebelumnya</NavDirection>
        <NavTitle>{prevSubtopic?.name}</NavTitle>
      </NavButton>
      <NavButton onClick={() => nextSubtopic && onNavigate(nextSubtopic.slug)} disabled={!nextSubtopic} $align="right">
        <NavDirection>Berikutnya →</NavDirection>
        <NavTitle>{nextSubtopic?.name}</NavTitle>
      </NavButton>
    </NavRow>
  )
}
