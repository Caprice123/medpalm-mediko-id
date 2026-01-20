import { useEffect, useState } from 'react'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import {
  ModalContent,
  WarningIcon,
  ProcessingIcon,
  Message,
  BulletList,
  BulletItem,
  ProcessingSteps,
  ProcessingStep,
  StepIcon,
  StepText,
  SubMessage,
  ButtonGroup,
} from './EndSessionModal.styles'

const PROCESSING_STEPS = [
  { id: 'save', text: 'Menyimpan jawaban...', duration: 500 },
  { id: 'diagnosis', text: 'Mengevaluasi diagnosis...', duration: 1000 },
  { id: 'therapy', text: 'Mengevaluasi terapi...', duration: 1000 },
  { id: 'score', text: 'Menghitung skor akhir...', duration: 800 },
]

function EndSessionModal({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
  autoEnd = false, // true if triggered by timer
}) {
  const [currentStep, setCurrentStep] = useState(0)

  // Auto-confirm when autoEnd is true (timer expired)
  useEffect(() => {
    if (isOpen && autoEnd && !isProcessing) {
      onConfirm()
    }
  }, [isOpen, autoEnd, isProcessing, onConfirm])

  // Simulate processing steps for visual feedback
  useEffect(() => {
    if (!isProcessing) {
      setCurrentStep(0)
      return
    }

    let stepIndex = 0
    const intervals = []

    const scheduleStep = (index) => {
      if (index >= PROCESSING_STEPS.length) return

      const step = PROCESSING_STEPS[index]
      const timeout = setTimeout(() => {
        setCurrentStep(index + 1)
        scheduleStep(index + 1)
      }, step.duration)

      intervals.push(timeout)
    }

    scheduleStep(0)

    return () => {
      intervals.forEach(clearTimeout)
    }
  }, [isProcessing])

  const showConfirmation = !isProcessing && !autoEnd

  return (
    <Modal
      isOpen={isOpen}
      onClose={!isProcessing ? onClose : undefined}
      title={isProcessing ? (autoEnd ? '⏱️ Waktu Habis!' : '🔄 Mengevaluasi Sesi...') : '⚠️ Akhiri Sesi Latihan?'}
      size="medium"
      closeOnOverlayClick={!isProcessing}
    >
      <ModalContent>
        {showConfirmation && (
          <>
            <Message>
              Apakah Anda yakin ingin mengakhiri sesi ini?
            </Message>

            <BulletList>
              <BulletItem>• Sesi akan dievaluasi</BulletItem>
              <BulletItem>• Anda tidak bisa melanjutkan setelah mengakhiri</BulletItem>
              <BulletItem>• Pastikan semua jawaban sudah terisi</BulletItem>
            </BulletList>

            <ButtonGroup>
              <Button variant="secondary" onClick={onClose}>
                Batal
              </Button>
              <Button variant="primary" onClick={onConfirm}>
                Akhiri Sesi ✓
              </Button>
            </ButtonGroup>
          </>
        )}

        {isProcessing && (
          <>
            {autoEnd && (
              <Message style={{ marginBottom: '1.5rem' }}>
                Sesi Anda sedang dievaluasi...
              </Message>
            )}

            <ProcessingSteps>
              {PROCESSING_STEPS.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isPending = index > currentStep

                return (
                  <ProcessingStep key={step.id} completed={isCompleted}>
                    <StepIcon>
                      {isCompleted && '✓'}
                      {isCurrent && '🔄'}
                      {isPending && '⏳'}
                    </StepIcon>
                    <StepText completed={isCompleted}>
                      {step.text}
                    </StepText>
                  </ProcessingStep>
                )
              })}
            </ProcessingSteps>

            <SubMessage>
              Mohon tunggu, proses ini mungkin memakan waktu beberapa saat...
            </SubMessage>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default EndSessionModal
