import { PiXBold } from 'react-icons/pi'
import { Area, AreaHead, AreaBody } from '../../Station.styles'
import WorksheetSection from './components/WorksheetSection'
import SupportingDataSection from './components/SupportingDataSection'
import DiagnosisSection from './components/DiagnosisSection'
import TherapySection from './components/TherapySection'
import { useWorksheet } from './hooks/useWorksheet'
import { HeadRight, CloseWorksheet, Completeness } from './Worksheet.styles'

// The board's right area, and the reason this redesign exists: in V1 these three were tabs
// behind the conversation, so a student could reach the bell having never opened Diagnosis.
// Here their state is always on screen, whether or not their fields are.
function Worksheet({ isPsikiatri, answers, status, onClose }) {
  const { openKey, toggle } = useWorksheet(status.sections)

  const bodyFor = (key) => {
    if (key === 'supporting') return <SupportingDataSection answers={answers} />
    if (key === 'diagnosis') return <DiagnosisSection isPsikiatri={isPsikiatri} answers={answers} />

    return <TherapySection therapies={answers.therapies} setTherapies={answers.setTherapies} />
  }

  return (
    <Area aria-label="Lembar kerja">
      <AreaHead>
        <h2>Lembar kerja</h2>
        <HeadRight>
          <Completeness $complete={status.emptyCount === 0}>
            {status.emptyCount > 0 ? `${status.emptyCount} belum terisi` : 'Lengkap'}
          </Completeness>
          {onClose && (
            <CloseWorksheet
              type="button"
              onClick={onClose}
              title="Tutup lembar kerja"
              aria-label="Tutup lembar kerja"
            >
              <PiXBold size={13} />
            </CloseWorksheet>
          )}
        </HeadRight>
      </AreaHead>

      <AreaBody>
        {status.sections.map((section) => (
          <WorksheetSection
            key={section.key}
            label={section.label}
            filled={section.filled}
            detail={section.detail}
            isOpen={openKey === section.key}
            onToggle={() => toggle(section.key)}
          >
            {bodyFor(section.key)}
          </WorksheetSection>
        ))}
      </AreaBody>
    </Area>
  )
}

export default Worksheet
