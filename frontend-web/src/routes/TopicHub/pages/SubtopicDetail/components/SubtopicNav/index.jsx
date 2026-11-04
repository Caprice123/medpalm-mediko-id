import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import { NavRow, NavButton, NavDirection, NavTitle } from './SubtopicNav.styles'

export default function SubtopicNav({ prevSubtopic, nextSubtopic, onNavigate }) {
  if (!prevSubtopic && !nextSubtopic) return null

  return (
    <NavRow>
      <NavButton onClick={() => prevSubtopic && onNavigate(prevSubtopic.slug)} disabled={!prevSubtopic} $align="left">
        <NavDirection $align="left"><PiArrowLeft size={14} /> Sebelumnya</NavDirection>
        <NavTitle>{prevSubtopic?.name}</NavTitle>
      </NavButton>
      <NavButton onClick={() => nextSubtopic && onNavigate(nextSubtopic.slug)} disabled={!nextSubtopic} $align="right">
        <NavDirection $align="right">Berikutnya <PiArrowRight size={14} /></NavDirection>
        <NavTitle>{nextSubtopic?.name}</NavTitle>
      </NavButton>
    </NavRow>
  )
}
