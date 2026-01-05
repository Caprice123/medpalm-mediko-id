import { useSelector } from 'react-redux'
import {
  Container,
  ModeButton
} from './ModeSelector.styles'

function ModeSelector({ currentMode, onModeChange }) {
  const { availableModes, costs } = useSelector(state => state.chatbot)

  // All possible modes with their metadata
  const allModes = [
    { id: 'normal', icon: '🤖', label: 'Normal' },
    { id: 'validated', icon: '📚', label: 'Validated' },
    { id: 'research', icon: '🔍', label: 'Research' }
  ]

  // Filter modes based on availability and add costs from config
  const modes = allModes
    .filter(mode => availableModes[mode.id])
    .map(mode => ({
      ...mode,
      cost: costs && costs[mode.id] ? costs[mode.id] : 0
    }))

  // If no modes available, show message
  if (modes.length === 0) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
    return (
      <Container>
        <div style={{
          padding: isMobile ? '0.75rem' : '1rem',
          color: '#6b7280',
          textAlign: 'center',
          fontSize: isMobile ? '0.875rem' : '1rem'
        }}>
          No chat modes available
        </div>
      </Container>
    )
  }

  return (
    <Container>
      {modes.map((mode) => (
        <ModeButton
          key={mode.id}
          active={currentMode === mode.id}
          onClick={() => onModeChange(mode.id)}
        >
          <span>{mode.icon}</span>
          <span>{mode.label}</span>
          <span className="cost">{mode.cost} cr</span>
        </ModeButton>
      ))}
    </Container>
  )
}

export default ModeSelector
