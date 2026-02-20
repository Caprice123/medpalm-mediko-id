import { useSelector, shallowEqual } from 'react-redux'
import { useState, memo, useMemo } from 'react'
import {
  Container,
  ModeButton,
  InfoButton,
  InfoModal,
  InfoModalOverlay,
  InfoModalContent,
  InfoModalHeader,
  InfoModalBody,
  ModeInfo,
  CloseButton,
  ModesWrapper
} from './ModeSelector.styles'

function ModeSelector({ currentMode, onModeChange }) {
  // Debug: See when ModeSelector re-renders
  console.log('🔄 ModeSelector rendered')

  // Optimize selectors to prevent unnecessary re-renders
  const availableModes = useSelector(state => state.chatbot.availableModes, shallowEqual)
  const costs = useSelector(state => state.chatbot.costs, shallowEqual)
  const userInformation = useSelector(state => state.chatbot.userInformation, shallowEqual)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showModeModal, setShowModeModal] = useState(false)

  // All possible modes with their metadata
  const allModes = [
    {
      id: 'normal',
      icon: '🤖',
      label: 'Normal',
      description: userInformation?.normal || 'Respon cepat dengan AI tanpa pencarian basis data. Cocok untuk pertanyaan umum dan percakapan ringan.'
    },
    {
      id: 'validated',
      icon: '📚',
      label: 'Validated',
      description: userInformation?.validated || 'Menggunakan basis pengetahuan yang telah divalidasi. Jawaban lebih akurat dan terverifikasi dari sumber terpercaya.'
    },
    {
      id: 'research',
      icon: '🔍',
      label: 'Research',
      description: userInformation?.research || 'Pencarian mendalam dengan multiple sumber dan analisis komprehensif. Cocok untuk topik kompleks yang membutuhkan riset detail.'
    }
  ]

  // Filter modes based on availability and add costs from config - memoized
  const modes = useMemo(() => {
    return allModes
      .filter(mode => availableModes[mode.id])
      .map(mode => ({
        ...mode,
        cost: costs && costs[mode.id] ? costs[mode.id] : 0
      }))
  }, [availableModes, costs])

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

  const currentModeInfo = useMemo(() =>
    modes.find(m => m.id === currentMode),
    [modes, currentMode]
  )

  return (
    <>
      <Container>
        {/* Desktop: Show mode buttons */}
        <ModesWrapper className="desktop-only">
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
        </ModesWrapper>

        {/* Mobile: Show current mode button */}
        <ModeButton
          className="mobile-only"
          active={true}
          onClick={() => setShowModeModal(true)}
        >
          <span>{currentModeInfo?.icon}</span>
          <span>{currentModeInfo?.label}</span>
          <span className="cost">{currentModeInfo?.cost} cr</span>
          <span style={{ marginLeft: 'auto' }}>▼</span>
        </ModeButton>

        <InfoButton className="desktop-only" onClick={() => setShowInfoModal(true)}>
          ⓘ Info
        </InfoButton>
      </Container>

      {/* Info Modal */}
      {showInfoModal && (
        <InfoModal>
          <InfoModalOverlay onClick={() => setShowInfoModal(false)} />
          <InfoModalContent>
            <InfoModalHeader>
              <h3>Mode Chatbot</h3>
              <CloseButton onClick={() => setShowInfoModal(false)}>✕</CloseButton>
            </InfoModalHeader>
            <InfoModalBody>
              {allModes.map((mode) => (
                <ModeInfo key={mode.id}>
                  <div className="mode-header">
                    <span className="mode-icon">{mode.icon}</span>
                    <span className="mode-label">{mode.label}</span>
                  </div>
                  <p className="mode-description">{mode.description}</p>
                </ModeInfo>
              ))}
            </InfoModalBody>
          </InfoModalContent>
        </InfoModal>
      )}

      {/* Mode Selector Modal (Mobile) */}
      {showModeModal && (
        <InfoModal>
          <InfoModalOverlay onClick={() => setShowModeModal(false)} />
          <InfoModalContent>
            <InfoModalHeader>
              <h3>Pilih Mode</h3>
              <CloseButton onClick={() => setShowModeModal(false)}>✕</CloseButton>
            </InfoModalHeader>
            <InfoModalBody>
              {modes.map((mode) => (
                <ModeButton
                  key={mode.id}
                  active={currentMode === mode.id}
                  onClick={() => {
                    onModeChange(mode.id)
                    setShowModeModal(false)
                  }}
                  className="mode-card"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{mode.icon}</span>
                      <span>{mode.label}</span>
                    </div>
                    <span className="cost">{mode.cost} cr</span>
                  </div>
                  <p className="mode-description">{mode.description}</p>
                </ModeButton>
              ))}
            </InfoModalBody>
          </InfoModalContent>
        </InfoModal>
      )}
    </>
  )
}

export default memo(ModeSelector, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these specific props change
  return (
    prevProps.currentMode === nextProps.currentMode &&
    prevProps.onModeChange === nextProps.onModeChange
  )
})
