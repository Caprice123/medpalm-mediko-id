import { memo } from 'react'
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

const ModeSelector = memo(({ currentMode, onModeChange, onOpenResearchSettings }) => {
  const {
    modes,
    allModes,
    currentModeInfo,
    openModal,
    showInfoModal,
    showModePicker,
    closeModal,
  } = useModeSelector(currentMode)

  if (modes.length === 0) {
    return (
      <Container>
        <UnavailableNotice>Tidak ada mode yang tersedia</UnavailableNotice>
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
        {/* Desktop: both modes side by side. */}
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

        {/* Only research mode reads the journal and year filters, so the
            settings button appears only while it is selected. */}
        {onOpenResearchSettings && (
          <InfoButton onClick={onOpenResearchSettings}>
            ⚙ Research
          </InfoButton>
        )}
      </Container>

      {openModal === 'info' && (
        <InfoModal>
          <InfoModalOverlay onClick={closeModal} />
          <InfoModalContent>
            <InfoModalHeader>
              <h3>Mode</h3>
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
    </>
  )
})

ModeSelector.displayName = 'ModeSelector'

export default ModeSelector
