import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllRubrics } from '@store/oscePractice/adminAction'
import Select from 'react-select'

function RubricDropdown({ value, onChange, error, required = false }) {
  const dispatch = useDispatch()
  const { allRubrics, loading } = useSelector(state => state.oscePractice)

  useEffect(() => {
    dispatch(fetchAllRubrics())
  }, [dispatch])

  const options = allRubrics.map(rubric => ({
    value: rubric.id,
    label: rubric.name,
  }))

  const selectedOption = options.find(opt => opt.value === value) || null

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.875rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: '#374151'
      }}>
        Rubric {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <Select
        value={selectedOption}
        onChange={onChange}
        options={options}
        isLoading={loading.isFetchingAllRubrics}
        placeholder="Pilih rubrik evaluasi..."
        noOptionsMessage={() => "Tidak ada rubrik tersedia"}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
            '&:hover': {
              borderColor: error ? '#ef4444' : '#3b82f6',
            },
          }),
        }}
      />
      {error && (
        <div style={{
          marginTop: '0.25rem',
          fontSize: '0.875rem',
          color: '#ef4444'
        }}>
          {error}
        </div>
      )}
      <div style={{
        marginTop: '0.25rem',
        fontSize: '0.75rem',
        color: '#6b7280'
      }}>
        Pilih rubrik yang akan digunakan untuk mengevaluasi topik OSCE ini
      </div>
    </div>
  )
}

export default RubricDropdown
