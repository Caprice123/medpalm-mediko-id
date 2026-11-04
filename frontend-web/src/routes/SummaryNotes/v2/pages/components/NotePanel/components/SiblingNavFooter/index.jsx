import { PiArrowLeft, PiArrowRight } from 'react-icons/pi'
import {
  NavFooter, NavButton, NavArrow, NavInfo, NavDirection, NavLabel,
} from './SiblingNavFooter.styles'

export default function SiblingNavFooter({ previous, next, isLoading, onNavigate }) {
  if (!previous && !next) return null

  return (
    <NavFooter aria-label="Navigasi antar subtopik">
      {previous && (
        <NavButton $direction="previous" disabled={isLoading} onClick={() => onNavigate(previous)}>
          <NavArrow><PiArrowLeft /></NavArrow>
          <NavInfo>
            <NavDirection>Sebelumnya</NavDirection>
            <NavLabel title={previous.name}>{previous.name}</NavLabel>
          </NavInfo>
        </NavButton>
      )}
      {next && (
        <NavButton $direction="next" disabled={isLoading} onClick={() => onNavigate(next)}>
          <NavArrow><PiArrowRight /></NavArrow>
          <NavInfo>
            <NavDirection>Berikutnya</NavDirection>
            <NavLabel title={next.name}>{next.name}</NavLabel>
          </NavInfo>
        </NavButton>
      )}
    </NavFooter>
  )
}
