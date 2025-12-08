import { memo } from 'react'
import { InputWrapper, Label, RequiredMark, StyledInput, HintText, ErrorText } from './TextInput.styles'

/**
 * Reusable TextInput component
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {boolean} props.required - Show required asterisk
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {boolean} props.disabled - Disable the input
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.size - Input size: 'small', 'medium', 'large'
 * @param {string} props.name - Input name
 * @param {string} props.className - Additional CSS class
 */
const TextInput = memo(function TextInput({
  label,
  required = false,
  value,
  onChange,
  onBlur,
  placeholder = '',
  type = 'text',
  disabled = false,
  error = '',
  hint = '',
  size = 'medium',
  name,
  className = '',
  autoFocus = false,
  ...rest
}) {
  return (
    <InputWrapper className={className}>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <StyledInput
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        hasError={!!error}
        size={size}
        autoFocus={autoFocus}
        {...rest}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && <HintText>{hint}</HintText>}
    </InputWrapper>
  )
})

export default TextInput
