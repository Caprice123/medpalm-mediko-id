import { useState, useMemo, memo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Textarea from '@components/common/Textarea'
import FileUpload from '@components/common/FileUpload'
import { upload } from '@store/common/action'
import styled from 'styled-components'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import Button from '@components/common/Button'

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`

const HintText = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
`

const WarningText = styled.p`
  font-size: 0.75rem;
  color: #dc2626;
  font-weight: 600;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 4px;
`

const MAX_OBSERVATIONS = 5

const ObservationGroup = styled.div`
  margin-bottom: 1.5rem;
`

const GroupTitle = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: #1f2937;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const ObservationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`

const ObservationCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #f9fafb;
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    flex-shrink: 0;
  }
`

const ObservationDetails = styled.div`
  padding: 1rem;
  margin-left: 1.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #374151;
  margin-top: 0.75rem;
  cursor: pointer;
`

const ImagePreview = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 4px;
  margin-top: 0.5rem;
`

// Memoized sub-component for each observation detail item
const ObservationDetailItem = memo(({
  observationData,
  onTextChange,
  onInterpretationChange,
  onImageUpload,
  onImageRemove,
  loading
}) => {
  return (
    <ObservationDetails>
      <div style={{ marginBottom: '1rem', fontWeight: '600', fontSize: '0.875rem', color: '#1f2937' }}>
        {observationData.groupName} - {observationData.observationName}
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <Textarea
          label="Observation Result/Text"
          placeholder="Enter the observation result or text shown to students..."
          value={observationData.observationText}
          onChange={(e) => onTextChange(observationData.observationId, e.target.value)}
          rows={3}
          hint="This is what students will see when they request this observation"
        />
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
          Observation Image (Optional)
        </label>
        <FileUpload
          file={observationData.blobId ? {
            name: observationData.filename || 'File name',
            type: observationData.contentType || 'image/*',
            size: observationData.size
          } : null}
          onRemove={() => onImageRemove(observationData.observationId)}
          actions={
            <>
              {observationData.url && (
                <PhotoView src={observationData.url}>
                  <Button variant="primary" type="button">
                    👁️ Preview
                  </Button>
                </PhotoView>
              )}
            </>
          }
          onFileSelect={(files) => onImageUpload(observationData.observationId, files)}
          loading={loading}
          acceptedTypes={['image/jpeg', 'image/jpg', 'image/png']}
          acceptedTypesLabel="JPEG or PNG"
          maxSizeMB={5}
          uploadText="Click to upload observation image"
        />
      </div>

      <CheckboxLabel>
        <input
          type="checkbox"
          checked={observationData.requiresInterpretation}
          onChange={(e) => onInterpretationChange(observationData.observationId, e.target.checked)}
        />
        Requires student interpretation
      </CheckboxLabel>
    </ObservationDetails>
  )
}, (prevProps, nextProps) => {
  // Only re-render if this specific observation's data changed
  return JSON.stringify(prevProps.observationData) === JSON.stringify(nextProps.observationData) &&
         prevProps.loading === nextProps.loading
})

const ObservationSection = ({ observations: selectedObservations, setFieldValue }) => {
  const dispatch = useDispatch()
  const { observations } = useSelector(state => state.oscePractice)
  const { loading } = useSelector(state => state.common)
  const [searchQuery, setSearchQuery] = useState('')

  const isObservationChecked = useCallback((observationId) => {
    return selectedObservations.some(obs => obs.observationId === observationId)
  }, [selectedObservations])

  const handleObservationToggle = useCallback((observation, groupName) => {
    const index = selectedObservations.findIndex(obs => obs.observationId === observation.id)

    if (index >= 0) {
      // Remove observation
      setFieldValue(
        'observations',
        selectedObservations.filter((_, i) => i !== index)
      )
    } else {
      // Check if max limit reached
      if (selectedObservations.length >= MAX_OBSERVATIONS) {
        return // Don't add if limit reached
      }

      // Add observation
      setFieldValue('observations', [
        ...selectedObservations,
        {
          observationId: observation.id,
          observationName: observation.name,
          groupName: groupName,
          observationText: '',
          blobId: null,
          filename: null,
          size: null,
          url: null,
          contentType: null
        }
      ])
    }
  }, [selectedObservations, setFieldValue])

  const filteredObservations = useMemo(() => {
    const groups = observations || []
    if (!searchQuery) return groups

    return groups.map(group => ({
      ...group,
      observations: group.observations.filter(obs =>
        obs.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(group => group.observations.length > 0)
  }, [observations, searchQuery])

  const handleObservationTextChange = useCallback((observationId, value) => {
    const index = selectedObservations.findIndex(obs => obs.observationId === observationId)
    if (index >= 0) {
      setFieldValue(`observations[${index}].observationText`, value)
    }
  }, [selectedObservations, setFieldValue])

  const handleRequiresInterpretationChange = useCallback((observationId, value) => {
    const index = selectedObservations.findIndex(obs => obs.observationId === observationId)
    if (index >= 0) {
      setFieldValue(`observations[${index}].requiresInterpretation`, value)
    }
  }, [selectedObservations, setFieldValue])

  const handleImageUpload = useCallback(async (observationId, files) => {
    if (!files || files.length === 0) return

    const file = files
    const result = await dispatch(upload(file, 'osce_observation_image'))
    if (result) {
      const index = selectedObservations.findIndex(obs => obs.observationId === observationId)
      if (index >= 0) {
        setFieldValue(`observations[${index}].blobId`, result.blobId)
        setFieldValue(`observations[${index}].filename`, result.filename)
        setFieldValue(`observations[${index}].size`, result.byteSize)
        setFieldValue(`observations[${index}].url`, result.url)
        setFieldValue(`observations[${index}].contentType`, result.contentType)
      }
    }
  }, [selectedObservations, setFieldValue, dispatch])

  const handleImageRemove = useCallback((observationId) => {
    const index = selectedObservations.findIndex(obs => obs.observationId === observationId)
    if (index >= 0) {
      const newObservations = [...selectedObservations]
      newObservations[index] = {
        ...newObservations[index],
        blobId: null,
        filename: null,
        size: null,
        url: null,
        contentType: null
      }
      setFieldValue('observations', newObservations)
    }
  }, [selectedObservations, setFieldValue])

  const isMaxReached = selectedObservations.length >= MAX_OBSERVATIONS

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
        Observations
      </label>

      <SearchInput
        type="text"
        placeholder="Cari pemeriksaan penunjang..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <HintText>
        Select observations that students can request during this OSCE practice (Maximum {MAX_OBSERVATIONS} observations - {selectedObservations.length}/{MAX_OBSERVATIONS} selected)
      </HintText>

      {isMaxReached && (
        <WarningText>
          ⚠️ Maximum limit reached! You can select up to {MAX_OBSERVATIONS} observations. Remove some to add others.
        </WarningText>
      )}

      {filteredObservations.map(group => (
        <ObservationGroup key={group.id}>
          <GroupTitle>{group.name}</GroupTitle>

          <ObservationGrid>
            {(group.observations || []).map(observation => {
              const isChecked = isObservationChecked(observation.id)
              const isDisabled = !isChecked && isMaxReached

              return (
                <ObservationCheckbox key={observation.id} style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled}
                    onChange={() => handleObservationToggle(observation, group.name)}
                    style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                  />
                  {observation.name}
                </ObservationCheckbox>
              )
            })}
          </ObservationGrid>
        </ObservationGroup>
      ))}

      {(!observations || observations.length === 0) && (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          color: '#9ca3af',
          border: '1px dashed #d1d5db',
          borderRadius: '8px',
          fontSize: '0.875rem'
        }}>
          No observations available. Please create observations first.
        </div>
      )}

      {/* Detail inputs for selected observations */}
      {selectedObservations.length > 0 && (
        <PhotoProvider>
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
              Selected Observation Details
            </h3>

            {selectedObservations.map((observationData) => (
              <ObservationDetailItem
                key={observationData.observationId}
                observationData={observationData}
                onTextChange={handleObservationTextChange}
                onInterpretationChange={handleRequiresInterpretationChange}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                loading={loading}
              />
            ))}
          </div>
        </PhotoProvider>
      )}
    </div>
  )
}

export default memo(ObservationSection, (prevProps, nextProps) => {
  // Only re-render if observations array changed
  return JSON.stringify(prevProps.observations) === JSON.stringify(nextProps.observations)
})
