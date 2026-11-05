import { useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { EvidenceEmpty } from '../../../../Debrief.styles'
import {
  Investigation,
  Plate,
  Findings,
  Interpretation,
  NotAnswered,
} from '../../EvidencePanel.styles'

// The investigations the student chose, their results, and the reading the student gave them.
function InvestigationsView() {
  const observations = useSelector(
    (state) => state.oscePractice.sessionDetail?.userAnswer?.observations,
  ) || []

  if (observations.length === 0) {
    return (
      <EvidenceEmpty>
        Tidak ada pemeriksaan penunjang yang diminta di sesi ini.
      </EvidenceEmpty>
    )
  }

  return (
    <PhotoProvider>
      {observations.map((observation) => (
        <Investigation key={observation.snapshotId}>
          <h3>{observation.name}</h3>

          {observation.attachments?.url && (
            <PhotoView src={observation.attachments.url}>
              <Plate type="button" title="Perbesar hasil">
                <img
                  src={observation.attachments.url}
                  alt={observation.attachments.name || observation.name}
                />
              </Plate>
            </PhotoView>
          )}

          {observation.observationText ? (
            // Findings are authored as rich text in the admin panel, so they are injected
            // rather than rendered as markdown.
            <Findings dangerouslySetInnerHTML={{ __html: observation.observationText }} />
          ) : (
            <Findings>Tidak ada data.</Findings>
          )}

          {observation.requiresInterpretation && (
            <Interpretation>
              <h4>Interpretasi kamu</h4>
              {observation.notes?.trim() ? (
                <p>{observation.notes}</p>
              ) : (
                <NotAnswered>Tidak diisi — dihitung nol pada rubrik.</NotAnswered>
              )}
            </Interpretation>
          )}
        </Investigation>
      ))}
    </PhotoProvider>
  )
}

export default InvestigationsView
