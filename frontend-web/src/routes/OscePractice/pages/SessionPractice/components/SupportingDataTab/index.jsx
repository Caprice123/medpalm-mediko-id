import { useState, useEffect, useMemo, memo } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  saveSessionObservations,
} from '@store/oscePractice/userAction'
import TextInput from '@components/common/TextInput'
import Button from "@components/common/Button"
import {
  FormContainer,
  ObservationHeader,
  ObservationTitle,
  ObservationSubtitle,
  SearchInput,
  SelectionCounter,
  ObservationGroup,
  GroupHeader,
  ObservationGrid,
  ObservationCheckbox,
  SaveObservationsButton,
  ObservationResultCard,
  ResultTitle,
  ResultContent,
  InterpretationTextarea,
  EmptyState,
  FormSection,
} from '../../SessionPractice.styles'
import { fetchSessionDetail } from '../../../../../../store/oscePractice/userAction'

const MAX_SELECTIONS = 5

function SupportingDataTab() {
  const { sessionId } = useParams()
  const dispatch = useDispatch()
  const { sessionDetail } = useSelector(state => state.oscePractice)
  const isSavingSessionObservations = useSelector(state => state.oscePractice.loading.isSavingSessionObservations)

  const [availableObservations, setAvailableObservations] = useState([])
  const [selectedObservations, setSelectedObservations] = useState([])
  const [observationsLocked, setObservationsLocked] = useState(sessionDetail?.observationsLocked || false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [interpretations, setInterpretations] = useState({})

  // Fetch observations on mount
  useEffect(() => {
    if (!sessionDetail) return

    // Flatten grouped observations from API
    const groupedData = sessionDetail.availableObservation || []
    const flatObservations = []

    groupedData.forEach(group => {
      group.observations.forEach(obs => {
        flatObservations.push({
          ...obs,
          groupName: group.groupName,
          id: obs.snapshotId, // Use snapshotId as id
        })
      })
    })

    setAvailableObservations(flatObservations)
    setObservationsLocked(sessionDetail.observationsLocked || false)

    // Load saved observations if locked
    if (sessionDetail.observationsLocked && sessionDetail.userAnswer?.observations) {
      setSelectedObservations(sessionDetail.userAnswer.observations || [])

      // Populate interpretations
      const interp = {}
      sessionDetail.userAnswer.observations.forEach(obs => {
        if (obs.notes) {
          interp[obs.snapshotId] = obs.notes
        }
      })
      setInterpretations(interp)
    }
  }, [sessionDetail])

  // Group observations by group name
  const groupedObservations = useMemo(() => {
    const groups = {}

    availableObservations.forEach(obs => {
      const groupName = obs.groupName || 'Lainnya'
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(obs)
    })

    return groups
  }, [availableObservations])

  // Filter observations based on search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedObservations

    const filtered = {}
    Object.entries(groupedObservations).forEach(([groupName, observations]) => {
      const matchingObs = observations.filter(obs =>
        obs.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matchingObs.length > 0) {
        filtered[groupName] = matchingObs
      }
    })

    return filtered
  }, [groupedObservations, searchQuery])

  const handleToggleObservation = (observationId) => {
    if (selectedIds.includes(observationId)) {
      // Deselect
      setSelectedIds(prev => prev.filter(id => id !== observationId))
    } else {
      // Select (if not at max)
      if (selectedIds.length < MAX_SELECTIONS) {
        setSelectedIds(prev => [...prev, observationId])
      }
    }
  }

  const handleInterpretationChange = (snapshotId, value) => {
    setInterpretations(prev => ({
      ...prev,
      [snapshotId]: value,
    }))
  }

  const handleSaveSelection = async () => {
    if (selectedIds.length === 0) {
      alert('Pilih minimal 1 pemeriksaan penunjang')
      return
    }

    if (!window.confirm(`Anda yakin ingin menyimpan ${selectedIds.length} pemeriksaan penunjang? Setelah disimpan, Anda tidak bisa mengubah pilihan lagi.`)) {
      return
    }

    // Just send array of snapshotIds for selection
    await dispatch(saveSessionObservations(
        sessionId,
        { snapshotIds: selectedIds },
        () => {
            dispatch(fetchSessionDetail(sessionId))
            alert('Pemeriksaan penunjang berhasil dipilih! Silakan isi interpretasi jika diperlukan.')
        }
    ))
  }

  console.log(selectedObservations)

  // Show results view if observations are locked
  if (observationsLocked) {
    return (
      <FormContainer>
        <ObservationHeader>
          <ObservationTitle>📋 Pemeriksaan Penunjang yang Dipilih</ObservationTitle>
          <ObservationSubtitle>
            Isi interpretasi untuk setiap pemeriksaan yang diperlukan
          </ObservationSubtitle>
        </ObservationHeader>

        {selectedObservations.length === 0 ? (
          <EmptyState>Tidak ada pemeriksaan penunjang yang dipilih</EmptyState>
        ) : (
          <>
            {selectedObservations.map(obs => (
              <ObservationResultCard key={obs.snapshotId}>
                <ResultTitle>{obs.name}</ResultTitle>

                {/* Show observation images */}
                {obs.attachments && (
                  <div style={{ marginBottom: '1rem' }}>
                    <PhotoProvider>
                        <PhotoView key={obs.attachments.id} src={obs.attachments.url}>
                            <div style={{ cursor: 'pointer' }}>
                              <img
                                src={obs.attachments.url}
                                alt={obs.attachments.name}
                                style={{
                                  width: "100%",
                                  height: '400px',
                                  objectFit: 'contain',
                                  borderRadius: '6px',
                                }}
                              />
                            </div>
                          </PhotoView>
                    </PhotoProvider>
                  </div>
                )}

                {/* Show observation text */}
                {obs.observationText ? (
                  <ResultContent>
                    <div dangerouslySetInnerHTML={{ __html: obs.observationText }} />
                  </ResultContent>
                ) : (
                  <ResultContent>Tidak ada data</ResultContent>
                )}

                {/* Show interpretation field if required */}
                {obs.requiresInterpretation && (
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      marginBottom: '0.5rem',
                      color: '#1a1a1a',
                    }}>
                      Interpretasi Anda *
                    </label>
                    <InterpretationTextarea
                      placeholder="Tuliskan interpretasi Anda berdasarkan hasil pemeriksaan..."
                      value={interpretations[obs.snapshotId] || ''}
                      onChange={(e) => handleInterpretationChange(obs.snapshotId, e.target.value)}
                    />
                  </div>
                )}
              </ObservationResultCard>
            ))}
          </>
        )}
      </FormContainer>
    )
  }

  // Show selection view
  return (
    <FormContainer>
        <FormSection>
            <TextInput
                placeholder="Cari pemeriksaan penunjang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </FormSection>

      <SelectionCounter>
        {selectedIds.length} / {MAX_SELECTIONS} terpilih
      </SelectionCounter>

      {Object.entries(filteredGroups).map(([groupName, observations]) => (
        <ObservationGroup key={groupName}>
          <GroupHeader>{groupName}</GroupHeader>
          <ObservationGrid>
            {observations.map(obs => (
              <ObservationCheckbox
                key={obs.id}
                checked={selectedIds.includes(obs.id)}
                disabled={!selectedIds.includes(obs.id) && selectedIds.length >= MAX_SELECTIONS}
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(obs.id)}
                  onChange={() => handleToggleObservation(obs.id)}
                  disabled={!selectedIds.includes(obs.id) && selectedIds.length >= MAX_SELECTIONS}
                />
                <span>{obs.name}</span>
              </ObservationCheckbox>
            ))}
          </ObservationGrid>
        </ObservationGroup>
      ))}

      <div style={{ flex: 1 }}></div>
      <div style={{ margin: "0 auto"}}>
        <Button variant="primary"
            onClick={handleSaveSelection}
            disabled={isSavingSessionObservations || selectedIds.length === 0}
        >
            {isSavingSessionObservations ? 'Menyimpan...' : 'Simpan Pilihan Pemeriksaan'}
        </Button>
      </div>
    </FormContainer>
  )
}

export default memo(SupportingDataTab)
