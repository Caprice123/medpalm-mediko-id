import { memo } from 'react'
import JournalSearchModal from '../JournalSearchModal'
import { useModeSelector } from './hooks/useModeSelector'
import {
  Container,
  ModesWrapper,
  ModeButton,
  InfoButton,
  InfoModal,
  InfoModalOverlay,
  InfoModalContent,
  InfoModalHeader,
  InfoModalBody,
  ModeInfo,
  CloseButton,
  ModeCardTopRow,
  ModeCardIdentity,
  DropdownCaret,
  UnavailableNotice,
} from './ModeSelector.styles'

const ModeSelector = ({ currentMode, onModeChange }) => {
  const {
    modes,
    allModes,
    currentModeInfo,
    hasResearchMode,
    openModal,
    showInfoModal,
    showModePicker,
    showResearchSettings,
    closeModal,
  } = useModeSelector(currentMode)

  if (modes.length === 0) {
    return (
      <Container>
        <UnavailableNotice>Tidak ada mode chat yang tersedia</UnavailableNotice>
      </Container>
    )
  }

  const pickMode = (mode) => {
    onModeChange(mode)
    closeModal()
  }

  return (
    <>
      <Container>
        {/* Desktop: all modes side by side. */}
        <ModesWrapper className="desktop-only">
          {modes.map((mode) => (
            <ModeButton
              key={mode.id}
              $active={currentMode === mode.id}
              onClick={() => onModeChange(mode.id)}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
              <span className="cost">{mode.cost} cr</span>
            </ModeButton>
          ))}
        </ModesWrapper>

        {/* Mobile: the current mode collapses into one control that opens a picker. */}
        <ModeButton className="mobile-only" $active onClick={showModePicker}>
          <span>{currentModeInfo?.icon}</span>
          <span>{currentModeInfo?.label}</span>
          <span className="cost">{currentModeInfo?.cost} cr</span>
          <DropdownCaret>▼</DropdownCaret>
        </ModeButton>

        <InfoButton className="desktop-only" onClick={showInfoModal}>
          ⓘ Info
        </InfoButton>

        {hasResearchMode && (
          <InfoButton onClick={showResearchSettings}>
            ⚙ Research
          </InfoButton>
        )}
      </Container>

      {openModal === 'info' && (
        <InfoModal>
          <InfoModalOverlay onClick={closeModal} />
          <InfoModalContent>
            <InfoModalHeader>
              <h3>Mode Chatbot</h3>
              <CloseButton onClick={closeModal}>✕</CloseButton>
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

      {openModal === 'modes' && (
        <InfoModal>
          <InfoModalOverlay onClick={closeModal} />
          <InfoModalContent>
            <InfoModalHeader>
              <h3>Pilih Mode</h3>
              <CloseButton onClick={closeModal}>✕</CloseButton>
            </InfoModalHeader>
            <InfoModalBody>
              {modes.map((mode) => (
                <ModeButton
                  key={mode.id}
                  className="mode-card"
                  $active={currentMode === mode.id}
                  onClick={() => pickMode(mode.id)}
                >
                  <ModeCardTopRow>
                    <ModeCardIdentity>
                      <span>{mode.icon}</span>
                      <span>{mode.label}</span>
                    </ModeCardIdentity>
                    <span className="cost">{mode.cost} cr</span>
                  </ModeCardTopRow>
                  <p className="mode-description">{mode.description}</p>
                </ModeButton>
              ))}
            </InfoModalBody>
          </InfoModalContent>
        </InfoModal>
      )}

      <JournalSearchModal isOpen={openModal === 'research'} onClose={closeModal} />
    </>
  )
}

export default memo(ModeSelector)
