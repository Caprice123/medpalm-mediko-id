import { memo } from 'react'
import Select from 'react-select'

/**
 * Reusable Tag Selector Component with react-select (Multi-select)
 *
 * @param {Object} props
 * @param {string} props.label - Label for the tag selector (e.g., "Universitas", "Semester")
 * @param {Array} props.allTags - All available tags to select from
 * @param {Array} props.selectedTags - Currently selected tags
 * @param {Function} props.onTagsChange - Callback when tags change (receives updated array)
 * @param {string} props.placeholder - Placeholder text for the dropdown
 * @param {string} props.helpText - Help text shown below the selector
 */
const TagSelector = memo(function TagSelector({
  allTags = [],
  selectedTags = [],
  onTagsChange,
  placeholder = "-- Select --",
  helpText
}) {
    console.log("first")
  // Convert tags to react-select format
  const options = allTags.map(tag => ({
    value: tag.id,
    label: tag.name
  }))

  const selectedValues = selectedTags.map(tag => ({
    value: tag.id,
    label: tag.name
  }))

  const handleChange = (selectedOptions) => {
    // Convert back to tag objects
    const newTags = (selectedOptions || []).map(option => {
      const tag = allTags.find(t => t.id === option.value)
      return tag || { id: option.value, name: option.label }
    })
    onTagsChange(newTags)
  }

  // Custom styles for react-select
  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#3b82f6'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#eff6ff'
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: '#3b82f6'
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#ede9fe',
      borderRadius: '6px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#5b21b6',
      fontWeight: '500'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#5b21b6',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#ddd6fe',
        color: '#5b21b6'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 100
    })
  }

  return (
    <div>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        isClearable
        styles={customSelectStyles}
        noOptionsMessage={() => "No options available"}
        closeMenuOnSelect={false}
      />
      {helpText && (
        <p style={{
          margin: '0.5rem 0 0 0',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          {helpText}
        </p>
      )}
    </div>
  )
}, (prev, next) => {
    return prev.allTags.length === next.allTags.length &&
        prev.selectedTags.length === next.selectedTags.length
})

export default TagSelector
