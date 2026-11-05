import { Panel, PanelHead, MicroLabel, EvidenceEmpty } from '../../Debrief.styles'
import CriterionRow from './components/CriterionRow'
import { Arithmetic, WeightedTotal } from './RubricPanel.styles'

// The examiner's side of the board: every criterion, what it earned, and the reasoning.
function RubricPanel({ rubric }) {
  const rows = rubric?.rows || []

  return (
    <Panel>
      <PanelHead>
        <h2>Rubrik penilaian</h2>
        <MicroLabel>{rows.length} kriteria</MicroLabel>
      </PanelHead>

      {rows.length === 0 ? (
        <EvidenceEmpty>
          Sesi ini tidak punya rincian rubrik. Skor di atas tetap berlaku — rinciannya hanya ada
          untuk sesi yang dinilai dengan rubrik berkriteria.
        </EvidenceEmpty>
      ) : (
        <>
          {rows.map((criterion) => (
            <CriterionRow key={criterion.key} criterion={criterion} />
          ))}

          <Arithmetic>
            <span>Total kontribusi berbobot</span>
            <WeightedTotal>
              {rubric.weightedEarned.toFixed(2)} / {rubric.weightTotal}
            </WeightedTotal>
          </Arithmetic>
        </>
      )}
    </Panel>
  )
}

export default RubricPanel
