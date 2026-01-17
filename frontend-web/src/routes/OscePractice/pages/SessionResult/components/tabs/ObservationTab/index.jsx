import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionObservations } from '@store/oscePractice/userAction'
import { LoadingContainer, LoadingSpinner, EmptyState } from '../../../styles/shared'
import {
  Container,
  GroupSection,
  GroupTitle,
  ObservationsList,
  ObservationItem,
  Checkbox,
  ObservationContent,
  ObservationName,
  ObservationNotes,
  SummaryCard,
  SummaryText,
  SummaryCount,
} from './styles'

function ObservationTab({ sessionId }) {
  const dispatch = useDispatch()
  const { sessionObservations, loading } = useSelector(state => state.oscePractice)

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionObservations(sessionId))
    }
  }, [sessionId, dispatch])

  // Group observations by group name
  const groupedObservations = sessionObservations.reduce((acc, obs) => {
    const groupName = obs.groupName || 'Lainnya'
    if (!acc[groupName]) {
      acc[groupName] = []
    }
    acc[groupName].push(obs)
    return acc
  }, {})

  const checkedCount = sessionObservations.filter(obs => obs.isChecked).length
  const totalCount = sessionObservations.length

  if (loading.isLoadingSessionObservations) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
      </LoadingContainer>
    )
  }

  if (sessionObservations.length === 0) {
    return (
      <EmptyState>
        📋 Belum ada observasi yang dicatat dalam sesi ini.
      </EmptyState>
    )
  }

  return (
    <Container>
      <SummaryCard>
        <SummaryText>
          Observasi yang dilakukan:
        </SummaryText>
        <SummaryCount>
          {checkedCount} / {totalCount}
        </SummaryCount>
      </SummaryCard>

      {Object.entries(groupedObservations).map(([groupName, groupObs]) => (
        <GroupSection key={groupName}>
          <GroupTitle>{groupName}</GroupTitle>
          <ObservationsList>
            {groupObs.map((obs) => (
              <ObservationItem key={obs.id} checked={obs.isChecked}>
                <Checkbox checked={obs.isChecked} />
                <ObservationContent>
                  <ObservationName>{obs.name}</ObservationName>
                  {obs.notes && (
                    <ObservationNotes>
                      Catatan: {obs.notes}
                    </ObservationNotes>
                  )}
                </ObservationContent>
              </ObservationItem>
            ))}
          </ObservationsList>
        </GroupSection>
      ))}
    </Container>
  )
}

export default ObservationTab
