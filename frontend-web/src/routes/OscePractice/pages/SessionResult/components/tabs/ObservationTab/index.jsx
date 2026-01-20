import { useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  ObservationGrid,
  ObservationGroup,
  GroupHeader,
} from '../../../../SessionPractice/SessionPractice.styles'
import {
  Container,
  SummaryCard,
  SummaryText,
  SummaryCount,
  SectionHeader,
  SelectedObservationCard,
  SelectedObservationTitle,
  SelectedObservationImage,
  SelectedObservationText,
  InterpretationSection,
  InterpretationLabel,
  InterpretationText,
  Divider,
  ObservationCheckboxItem,
} from './styles'

function ObservationTab() {
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  // Flatten and group all available observations
  const flattenedObservations = []
  if (sessionDetail?.availableObservation) {
    sessionDetail.availableObservation.forEach(group => {
      group.observations.forEach(obs => {
        flattenedObservations.push({
          ...obs,
          groupName: group.groupName,
          id: obs.snapshotId,
        })
      })
    })
  }

  // Get selected observations from userAnswer
  const selectedObservations = sessionDetail?.userAnswer?.observations || []
  const selectedIds = selectedObservations.map(obs => obs.snapshotId)

  // Group available observations by group name and mark which ones are selected
  const groupedObservations = flattenedObservations.reduce((acc, obs) => {
    const groupName = obs.groupName || 'Lainnya'
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push({
      ...obs,
      isChecked: selectedIds.includes(obs.id),
    })
    return acc
  }, {})

  const checkedCount = selectedObservations.length
  const totalCount = flattenedObservations.length

  if (loading.isLoadingSessionDetail) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  if (flattenedObservations.length === 0) {
    return (
      <EmptyState>
        📋 Belum ada observasi yang tersedia dalam sesi ini.
      </EmptyState>
    )
  }

  return (
    <Container>
      {/* Summary */}
      <SummaryCard>
        <SummaryText>
          Observasi yang dipilih:
        </SummaryText>
        <SummaryCount>
          {checkedCount} / {totalCount}
        </SummaryCount>
      </SummaryCard>

      {/* Section 1: All Available Observations */}
      <SectionHeader>Daftar Observasi Tersedia</SectionHeader>
      {Object.entries(groupedObservations).map(([groupName, groupObs]) => (
        <ObservationGroup key={groupName}>
          <GroupHeader>{groupName}</GroupHeader>
          <ObservationGrid>
            {groupObs.map((obs) => (
              <ObservationCheckboxItem key={obs.id} checked={obs.isChecked}>
                <input
                  type="checkbox"
                  checked={obs.isChecked}
                  readOnly
                  disabled
                />
                <span>
                  {obs.name}
                  {obs.isChecked && <span style={{ marginLeft: '0.5rem', color: '#10b981', fontWeight: '600' }}>✓</span>}
                </span>
              </ObservationCheckboxItem>
            ))}
          </ObservationGrid>
        </ObservationGroup>
      ))}

      {/* Section 2: Selected Observations with Details */}
      {selectedObservations.length > 0 && (
        <>
          <Divider />
          <SectionHeader>Detail Observasi yang Dipilih</SectionHeader>

          {selectedObservations.map((obs) => (
            <SelectedObservationCard key={obs.snapshotId}>
              <SelectedObservationTitle>{obs.name}</SelectedObservationTitle>

              {/* Observation Image */}
              {obs.attachments && (
                <PhotoProvider>
                  <PhotoView src={obs.attachments.url}>
                    <SelectedObservationImage
                      src={obs.attachments.url}
                      alt={obs.name}
                    />
                  </PhotoView>
                </PhotoProvider>
              )}

              {/* Observation Text/Result */}
              {obs.observationText && (
                <SelectedObservationText>
                  <strong>Hasil Observasi:</strong>
                  <div dangerouslySetInnerHTML={{ __html: obs.observationText }} />
                </SelectedObservationText>
              )}

              {/* Interpretation */}
              {obs.requiresInterpretation && (
                <InterpretationSection>
                  <InterpretationLabel>Interpretasi:</InterpretationLabel>
                  <InterpretationText hasInterpretation={!!obs.notes}>
                    {obs.notes || 'Belum ada interpretasi'}
                  </InterpretationText>
                </InterpretationSection>
              )}
            </SelectedObservationCard>
          ))}
        </>
      )}
    </Container>
  )
}

export default ObservationTab
