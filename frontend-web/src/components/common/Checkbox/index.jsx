import { memo } from 'react'
import { CheckboxWrapper, StyledCheckbox, Label } from './Checkbox.styles'

/**
 * Reusable Checkbox component
 *
 * @param {Object} props
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Checkbox checked state
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disable the checkbox
 * @param {string} props.name - Checkbox name
 * @param {string} props.id - Checkbox id
 * @param {string} props.className - Additional CSS class
 * @param {boolean} props.noMargin - Remove bottom margin
 */
const Checkbox = memo(function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  name,
  id,
  className = '',
  noMargin = false,
  ...rest
}) {
  return (
    <CheckboxWrapper className={className} noMargin={noMargin}>
      <StyledCheckbox
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...rest}
      />
      {label && (
        <Label htmlFor={id}>
          {label}
        </Label>
      )}
    </CheckboxWrapper>
  )
}, (prevProps, nextProps) => {
  return prevProps.checked === nextProps.checked &&
    prevProps.disabled === nextProps.disabled
})

export default Checkbox
