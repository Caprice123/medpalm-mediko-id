import {
  PiWarningCircle,
  PiCheckCircle,
  PiCircleDashed,
  PiSpinnerGap,
  PiLock,
  PiClipboardText,
} from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useEndSessionDialog, EVALUATION_STEPS } from './hooks/useEndSessionDialog'
import {
  Lead,
  Unfilled,
  Consequences,
  Steps,
  Step,
  Sweep,
  Patience,
  Actions,
} from './EndSessionDialog.styles'

const stepState = (index, current) => {
  if (index < current) return 'done'
  if (index === current) return 'current'
  return 'pending'
}

const StepIcon = ({ state }) => {
  if (state === 'done') return <PiCheckCircle size={18} />
  if (state === 'current') return <PiSpinnerGap size={18} />
  return <PiCircleDashed size={18} />
}

// Ending a station is irreversible and it is what the rubric marks, so this is one of the few
// places a modal is right: it needs protected focus, and it is the last moment the board can
// name what the student is about to be marked zero on.
function EndSessionDialog({ isOpen, auto, isProcessing, status, onClose, onConfirm }) {
  const { step } = useEndSessionDialog({ isOpen, auto, isProcessing, onConfirm })

  if (!isOpen) return null

  const unfilled = status.sections.filter((section) => !section.filled)
  const askingFirst = !isProcessing && !auto

  return (
    <Modal
      isOpen
      onClose={isProcessing ? undefined : onClose}
      title={isProcessing
        ? (auto ? 'Waktu habis — sesi dinilai' : 'Mengevaluasi sesi')
        : 'Akhiri sesi latihan?'}
      size="medium"
      showCloseButton={!isProcessing}
      closeOnOverlayClick={false}
      footer={askingFirst ? (
        <Actions>
          <Button variant="secondary" onClick={onClose}>Kembali ke stasiun</Button>
          <Button variant="danger" onClick={onConfirm}>Akhiri & nilai</Button>
        </Actions>
      ) : null}
    >
      {askingFirst && (
        <>
          <Lead>Sesi akan langsung dinilai dan tidak bisa dilanjutkan lagi.</Lead>

          {unfilled.length > 0 && (
            <Unfilled>
              <h3>
                <PiWarningCircle size={17} />
                {unfilled.length} bagian lembar kerja masih kosong
              </h3>
              <ul>
                {unfilled.map((section) => <li key={section.key}>{section.label}</li>)}
              </ul>
            </Unfilled>
          )}

          <Consequences>
            <li>
              <PiClipboardText size={16} />
              Bagian yang dibiarkan kosong dihitung nol pada rubrik.
            </li>
            <li>
              <PiLock size={16} />
              Setelah dinilai, jawabanmu terkunci dan hanya bisa dibaca di halaman hasil.
            </li>
          </Consequences>
        </>
      )}

      {isProcessing && (
        <>
          {auto && <Lead>Bel sudah berbunyi. Jawabanmu sedang dinilai.</Lead>}

          <div style={{ marginTop: auto ? '1rem' : 0 }}>
            <Steps>
              {EVALUATION_STEPS.map((entry, index) => {
                const state = stepState(index, step)
                return (
                  <Step key={entry.key} $state={state}>
                    <StepIcon state={state} />
                    {entry.label}
                  </Step>
                )
              })}
            </Steps>
          </div>

          <Sweep aria-hidden="true" />
          <Patience>
            Penilaian rubrik dikerjakan model, jadi bisa memakan beberapa detik. Jangan tutup
            halaman ini.
          </Patience>
        </>
      )}
    </Modal>
  )
}

export default EndSessionDialog
