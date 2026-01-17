import { useState, useEffect, useMemo, memo } from 'react'
import { useParams } from 'react-router-dom'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'
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
} from '../../SessionPractice.styles'

const MAX_SELECTIONS = 5

function SupportingDataTab() {
  const { sessionId } = useParams()

  const [availableObservations, setAvailableObservations] = useState([])
  const [selectedObservations, setSelectedObservations] = useState([])
  const [observationsLocked, setObservationsLocked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [interpretations, setInterpretations] = useState({})

  // Fetch observations on mount
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        setIsLoading(true)
        const route = Endpoints.api.osceObservations(sessionId)
        const response = await getWithToken(route)

        if (response.data.success) {
          setAvailableObservations(response.data.data.availableObservations)
          setSelectedObservations(response.data.data.selectedObservations)
          setObservationsLocked(response.data.data.observationsLocked)

          // If already saved, populate selected IDs and interpretations
          if (response.data.data.observationsLocked) {
            const ids = response.data.data.selectedObservations.map(obs => obs.observationId)
            setSelectedIds(ids)

            const interp = {}
            response.data.data.selectedObservations.forEach(obs => {
              if (obs.notes) {
                interp[obs.observationId] = obs.notes
              }
            })
            setInterpretations(interp)
          }
        }
      } catch (error) {
        console.error('Error fetching observations:', error)
        alert('Gagal memuat data pemeriksaan penunjang')
      } finally {
        setIsLoading(false)
      }
    }

    fetchObservations()
  }, [sessionId])

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
      // Remove interpretation
      setInterpretations(prev => {
        const newInterp = { ...prev }
        delete newInterp[observationId]
        return newInterp
      })
    } else {
      // Select (if not at max)
      if (selectedIds.length < MAX_SELECTIONS) {
        setSelectedIds(prev => [...prev, observationId])
      }
    }
  }

  const handleInterpretationChange = (observationId, value) => {
    setInterpretations(prev => ({
      ...prev,
      [observationId]: value,
    }))
  }

  const handleSaveObservations = async () => {
    if (selectedIds.length === 0) {
      alert('Pilih minimal 1 pemeriksaan penunjang')
      return
    }

    // Check if interpretations are provided for observations that require them
    const selectedObs = availableObservations.filter(obs => selectedIds.includes(obs.id))
    const missingInterpretations = selectedObs.filter(
      obs => obs.requiresInterpretation && !interpretations[obs.id]?.trim()
    )

    if (missingInterpretations.length > 0) {
      alert(`Harap isi interpretasi untuk: ${missingInterpretations.map(o => o.name).join(', ')}`)
      return
    }

    if (!window.confirm(`Anda yakin ingin menyimpan ${selectedIds.length} pemeriksaan penunjang? Setelah disimpan, Anda tidak bisa mengubahnya lagi.`)) {
      return
    }

    try {
      setIsSaving(true)
      const route = Endpoints.api.osceObservations(sessionId)

      const observations = selectedIds.map(obsId => ({
        observationId: obsId,
        interpretation: interpretations[obsId] || null,
      }))

      const response = await postWithToken(route, { observations })

      if (response.data.success) {
        setObservationsLocked(true)
        setSelectedObservations(response.data.data)
        alert('Pemeriksaan penunjang berhasil disimpan!')
      }
    } catch (error) {
      console.error('Error saving observations:', error)
      alert(error.response?.data?.message || 'Gagal menyimpan pemeriksaan penunjang')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <FormContainer>
        <EmptyState>Memuat data pemeriksaan penunjang...</EmptyState>
      </FormContainer>
    )
  }

  // Show results view if observations are locked
  if (observationsLocked) {
    return (
      <FormContainer>
        <ObservationHeader>
          <ObservationTitle>📋 Pemeriksaan Penunjang yang Dipilih</ObservationTitle>
          <ObservationSubtitle>
            Hasil pemeriksaan yang telah Anda pilih
          </ObservationSubtitle>
        </ObservationHeader>

        {selectedObservations.length === 0 ? (
          <EmptyState>Tidak ada pemeriksaan penunjang yang dipilih</EmptyState>
        ) : (
          selectedObservations.map(obs => {
            const availObs = availableObservations.find(a => a.id === obs.observationId)
            return (
              <ObservationResultCard key={obs.id}>
                <ResultTitle>{obs.name}</ResultTitle>

                {availObs?.observationText ? (
                  <ResultContent>
                    <div dangerouslySetInnerHTML={{ __html: availObs.observationText }} />
                  </ResultContent>
                ) : (
                  <ResultContent>Tidak ada data</ResultContent>
                )}

                {obs.notes && (
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#1a1a1a' }}>
                      Interpretasi Anda:
                    </strong>
                    <div style={{
                      marginTop: '0.5rem',
                      padding: '0.75rem',
                      background: '#f0f9ff',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      color: '#1a1a1a',
                    }}>
                      {obs.notes}
                    </div>
                  </div>
                )}
              </ObservationResultCard>
            )
          })
        )}
      </FormContainer>
    )
  }

  // Show selection view
  return (
    <FormContainer>
      <ObservationHeader>
        <ObservationTitle>Pilih Pemeriksaan Penunjang</ObservationTitle>
        <ObservationSubtitle>Pilih maksimal {MAX_SELECTIONS} pemeriksaan yang diperlukan</ObservationSubtitle>
      </ObservationHeader>

      <SearchInput
        type="text"
        placeholder="Cari pemeriksaan penunjang..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

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

      {/* Interpretation inputs for selected observations that require it */}
      {selectedIds.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <GroupHeader>Interpretasi Hasil Pemeriksaan</GroupHeader>
          {selectedIds.map(obsId => {
            const obs = availableObservations.find(o => o.id === obsId)
            if (!obs || !obs.requiresInterpretation) return null

            return (
              <div key={obsId} style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.5rem',
                  color: '#1a1a1a',
                }}>
                  {obs.name} *
                </label>
                {obs.observationText && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    marginBottom: '0.5rem',
                    padding: '0.75rem',
                    background: '#f9f9f9',
                    borderRadius: '6px',
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: obs.observationText }} />
                  </div>
                )}
                <InterpretationTextarea
                  placeholder="Tuliskan interpretasi Anda berdasarkan hasil pemeriksaan..."
                  value={interpretations[obsId] || ''}
                  onChange={(e) => handleInterpretationChange(obsId, e.target.value)}
                />
              </div>
            )
          })}
        </div>
      )}

      <SaveObservationsButton
        onClick={handleSaveObservations}
        disabled={isSaving || selectedIds.length === 0}
      >
        {isSaving ? '⏳ Menyimpan...' : '💾 Simpan Pemeriksaan Penunjang'}
      </SaveObservationsButton>
    </FormContainer>
  )
}

export default memo(SupportingDataTab)
