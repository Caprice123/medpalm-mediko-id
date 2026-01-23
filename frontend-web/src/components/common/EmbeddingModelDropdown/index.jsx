import Dropdown from '@components/common/Dropdown'
import { embeddingModelsGrouped, getEmbeddingModelLabel } from '@config/aiModels'

/**
 * ModelDropdown component for selecting AI models
 *
 * @param {Object} props
 * @param {string} props.value - Selected model value
 * @param {Function} props.onChange - Callback when model changes, receives option object
 * @param {string} props.label - Label for the dropdown (default: "Model Generasi")
 * @param {string} props.hintText - Hint text below dropdown
 * @param {boolean} props.disabled - Disable the dropdown
 * @param {boolean} props.hasError - Show error state
 * @param {string} props.className - Additional CSS class
 */
function EmbeddingModelDropdown({
  value,
  onChange,
  label = 'Model Generasi',
  hintText,
  disabled = false,
  hasError = false,
  className = ''
}) {
  return (
    <Dropdown
      label={label}
      options={embeddingModelsGrouped}
      value={{
        value: value,
        label: getEmbeddingModelLabel(value)
      }}
      onChange={onChange}
      disabled={disabled}
      hasError={hasError}
      className={className}
    />
  )
}

export default EmbeddingModelDropdown
