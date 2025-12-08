import { memo } from 'react'
import { TextareaWrapper, Label, RequiredMark, StyledTextarea, CharCount, HintText, ErrorText } from './Textarea.styles'

/**
 * Reusable Textarea component
 *
 * @param {Object} props
 * @param {string} props.label - Textarea label
 * @param {boolean} props.required - Show required asterisk
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the textarea
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.size - Textarea size: 'small', 'medium', 'large'
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.showCharCount - Show character count
 * @param {number} props.rows - Number of rows
 * @param {string} props.name - Textarea name
 * @param {string} props.className - Additional CSS class
 */
const Textarea = memo(function Textarea({
  label,
  required = false,
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  disabled = false,
  error = '',
  hint = '',
  size = 'medium',
  maxLength,
  showCharCount = false,
  rows,
  name,
  className = '',
  ...rest
}) {
  const charCount = value?.length || 0
  const isOverLimit = maxLength && charCount > maxLength

  return (
    <TextareaWrapper className={className}>
      {label && (
        <Label>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </Label>
      )}
      <StyledTextarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        hasError={!!error}
        size={size}
        maxLength={maxLength}
        rows={rows}
        {...rest}
      />
      {error && <ErrorText>{error}</ErrorText>}
      {!error && hint && <HintText>{hint}</HintText>}
      {showCharCount && maxLength && (
        <CharCount isOverLimit={isOverLimit}>
          {charCount} / {maxLength}
        </CharCount>
      )}
    </TextareaWrapper>
  )
})

export default Textarea
