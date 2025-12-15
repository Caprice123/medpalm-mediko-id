import { memo } from 'react'
import Select from 'react-select'
import { Label, Wrapper } from './Dropdown.styles'

/**
 * Dropdown component using react-select
 *
 * @param {Object} props
 * @param {Array} props.options - Array of options: [{ value: string, label: string }]
 * @param {Object} props.value - Selected value: { value: string, label: string }
 * @param {Function} props.onChange - Callback when selection changes
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the dropdown
 * @param {boolean} props.hasError - Show error state
 * @param {boolean} props.usePortal - Render menu in portal (default: true)
 * @param {string} props.className - Additional CSS class
 */
const Dropdown = memo(function Dropdown({
    label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  hasError = false,
  usePortal = false,
  required = false,
  className = ''
}) {
  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderColor: hasError
        ? '#ef4444'
        : state.isFocused
          ? '#6BB9E8'
          : '#d1d5db',
      borderRadius: '6px',
      boxShadow: state.isFocused
        ? hasError
          ? '0 0 0 3px rgba(239, 68, 68, 0.1)'
          : '0 0 0 3px rgba(107, 185, 232, 0.15)'
        : 'none',
      '&:hover': {
        borderColor: hasError ? '#ef4444' : '#9ca3af',
      },
      backgroundColor: disabled ? '#f9fafb' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0.125rem 0.875rem',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    input: (provided) => ({
      ...provided,
      margin: 0,
      padding: 0,
      fontSize: '0.875rem',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: disabled ? '#d1d5db' : '#6b7280',
      padding: '8px',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : null,
      transition: 'transform 0.2s ease',
      '&:hover': {
        color: disabled ? '#d1d5db' : '#374151',
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '6px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
      zIndex: 10000,
      marginTop: '4px',
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '200px',
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: '#f1f1f1',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#cbd5e1',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#94a3b8',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgba(107, 185, 232, 0.15)'
        : state.isFocused
          ? 'rgba(107, 185, 232, 0.08)'
          : 'white',
      color: state.isSelected ? '#4A9ED4' : '#374151',
      fontWeight: state.isSelected ? '500' : '400',
      cursor: 'pointer',
      fontSize: '0.875rem',
      padding: '0.625rem 0.875rem',
      minHeight: '44px',
      display: 'flex',
      alignItems: 'center',
      '&:active': {
        backgroundColor: 'rgba(107, 185, 232, 0.15)',
      },
    }),
  }

  return (
    <Wrapper className={className}>
        {label && (
            <Label>
                {label}
                {required && <RequiredMark>*</RequiredMark>}
            </Label>
        )}
        <Select
          className={className}
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          isDisabled={disabled}
          styles={customStyles}
          menuPortalTarget={usePortal ? document.body : null}
          menuPosition={usePortal ? 'fixed' : 'absolute'}
          isClearable
          isSearchable
        />
    </Wrapper>
  )
}, (prev, next) => {
  return prev.options.length === next.options.length &&
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.hasError === next.hasError
})

export default Dropdown
