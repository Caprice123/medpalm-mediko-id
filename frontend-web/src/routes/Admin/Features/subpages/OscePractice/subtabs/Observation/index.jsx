import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchAdminOsceObservations,
} from '@store/oscePractice/adminAction'
import CreateObservationGroupModal from './CreateObservationGroupModal'
import CreateObservationModal from './CreateObservationModal'
import UpdateObservationGroupModal from './UpdateObservationGroupModal'
import UpdateObservationModal from './UpdateObservationModal'
import Button from '@components/common/Button'
import EmptyState from '@components/common/EmptyState'
import {
  Container,
  Header,
  HeaderButtons,
  AddButton,
  GroupSection,
  GroupHeader,
  GroupTitle,
  ObservationsGrid,
  ObservationCard,
  ObservationCheckbox,
  ObservationLabel,
  ObservationActions,
  IconButton,
  LoadingOverlay
} from './ObservationsTab.styles'

function ObservationsTab() {
  const dispatch = useDispatch()
  const { observations, loading } = useSelector(state => state.oscePractice)
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false)
  const [isCreateObservationModalOpen, setIsCreateObservationModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [editingObservation, setEditingObservation] = useState(null)

  useEffect(() => {
    dispatch(fetchAdminOsceObservations())
  }, [dispatch])

  if (loading.isGetListTopicsLoading) {
    return <LoadingOverlay>Loading observations...</LoadingOverlay>
  }

  if (!observations || observations.length === 0) {
    return (
      <Container>
        <Header>
          <HeaderButtons>
            <Button variant="primary" onClick={() => setIsCreateGroupModalOpen(true)}>
              Add Group
            </Button>
          </HeaderButtons>
        </Header>
        <EmptyState
          icon="📋"
          title="Belum ada observation groups"
          description="Buat group pertama untuk memulai."
        />
        {isCreateGroupModalOpen && (
          <CreateObservationGroupModal onClose={() => setIsCreateGroupModalOpen(false)} />
        )}
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <div style={{ flex: "1" }}></div>
        <HeaderButtons>
          <Button variant="primary" onClick={() => setIsCreateGroupModalOpen(true)}>
            Add Group
          </Button>
          <Button variant="primary" onClick={() => setIsCreateObservationModalOpen(true)}>
            Add Observation
          </Button>
        </HeaderButtons>
      </Header>

      {observations.map(group => (
        <GroupSection key={group.id}>
          <GroupHeader>
            <GroupTitle>{group.name}</GroupTitle>
            <ObservationActions>
              <IconButton
                onClick={() => setEditingGroup(group)}
                title="Edit Group"
              >
                ✏️
              </IconButton>
            </ObservationActions>
          </GroupHeader>

          <ObservationsGrid>
            {group.observations && group.observations.map(observation => (
              <ObservationCard key={observation.id}>
                <ObservationCheckbox>
                  <ObservationLabel>{observation.name}</ObservationLabel>
                </ObservationCheckbox>
                <ObservationActions>
                  <IconButton
                    onClick={() => setEditingObservation({ ...observation, groupId: group.id })}
                    title="Edit"
                  >
                    ✏️
                  </IconButton>
                </ObservationActions>
              </ObservationCard>
            ))}
          </ObservationsGrid>
        </GroupSection>
      ))}

      {isCreateGroupModalOpen && (
        <CreateObservationGroupModal onClose={() => setIsCreateGroupModalOpen(false)} />
      )}

      {isCreateObservationModalOpen && (
        <CreateObservationModal onClose={() => setIsCreateObservationModalOpen(false)} />
      )}

      {editingGroup && (
        <UpdateObservationGroupModal
          group={editingGroup}
          onClose={() => setEditingGroup(null)}
        />
      )}

      {editingObservation && (
        <UpdateObservationModal
          observation={editingObservation}
          onClose={() => setEditingObservation(null)}
        />
      )}
    </Container>
  )
}

export default ObservationsTab
