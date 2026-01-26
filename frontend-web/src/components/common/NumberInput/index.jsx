import { memo, useCallback } from 'react'
import TextInput from '@components/common/TextInput'

/**
 * NumberInput component - extends TextInput with smart number handling
 *
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {boolean} props.required - Show required asterisk
 * @param {string|number} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disable the input
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {number} props.min - Minimum value
 * @param {number} props.max - Maximum value
 * @param {boolean} props.allowNegative - Allow negative numbers (default: true)
 * @param {boolean} props.allowDecimal - Allow decimal numbers (default: false)
 * @param {string} props.name - Input name
 * @param {string} props.className - Additional CSS class
 */
const NumberInput = memo(function NumberInput({
  value,
  onChange,
  allowNegative = true,
  allowDecimal = false,
  min,
  max,
  ...rest
}) {
  const handleChange = useCallback((e) => {
    const inputValue = e.target.value
    const name = e.target.name

    // Allow empty string (user cleared the input)
    if (inputValue === '') {
      onChange({
        target: {
          name,
          value: ''
        }
      })
      return
    }

    // Handle single minus sign (intermediate state when typing negative number)
    if (inputValue === '-') {
      if (allowNegative) {
        onChange({
          target: {
            name,
            value: '-'
          }
        })
      }
      return
    }

    // Handle single "0."
    if (inputValue === '0.' && allowDecimal) {
      onChange({
        target: {
          name,
          value: '0.'
        }
      })
      return
    }

    // Handle "-0."
    if (inputValue === '-0.' && allowNegative && allowDecimal) {
      onChange({
        target: {
          name,
          value: '-0.'
        }
      })
      return
    }

    // Remove all non-numeric characters except minus and decimal point
    let cleanValue = inputValue.replace(/[^\d.-]/g, '')

    // Don't allow negative if allowNegative is false
    if (!allowNegative && cleanValue.includes('-')) {
      cleanValue = cleanValue.replace(/-/g, '')
    }

    // Only allow minus at the beginning
    if (cleanValue.includes('-')) {
      const minusCount = (cleanValue.match(/-/g) || []).length
      if (minusCount > 1 || cleanValue.indexOf('-') !== 0) {
        // Remove all minus signs and add back one at the start if needed
        const hadMinus = cleanValue.startsWith('-')
        cleanValue = cleanValue.replace(/-/g, '')
        if (hadMinus && allowNegative) {
          cleanValue = '-' + cleanValue
        }
      }
    }

    // Handle decimal point
    if (!allowDecimal) {
      cleanValue = cleanValue.replace(/\./g, '')
    } else {
      // Only allow one decimal point
      const parts = cleanValue.split('.')
      if (parts.length > 2) {
        cleanValue = parts[0] + '.' + parts.slice(1).join('')
      }
    }

    // Remove leading zeros (but preserve "0", "0.", "-0", "-0.")
    if (cleanValue && cleanValue !== '0' && cleanValue !== '-0') {
      if (cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
        cleanValue = cleanValue.replace(/^0+/, '')
        if (cleanValue === '' || cleanValue === '.') {
          cleanValue = '0' + cleanValue
        }
      }
      if (cleanValue.startsWith('-0') && !cleanValue.startsWith('-0.')) {
        cleanValue = '-' + cleanValue.substring(2).replace(/^0+/, '')
        if (cleanValue === '-' || cleanValue === '-.') {
          cleanValue = '-0' + cleanValue.substring(1)
        }
      }
    }

    // Validate against min/max if they exist
    if (cleanValue !== '' && cleanValue !== '-' && !cleanValue.endsWith('.')) {
      const numValue = parseFloat(cleanValue)

      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          cleanValue = min.toString()
        }
        if (max !== undefined && numValue > max) {
          cleanValue = max.toString()
        }
      }
    }

    onChange({
      target: {
        name,
        value: cleanValue
      }
    })
  }, [onChange, allowNegative, allowDecimal, min, max])

  return (
    <TextInput
      {...rest}
      type="text"
      inputMode="numeric"
      value={value}
      onChange={handleChange}
    />
  )
}, (prevProps, nextProps) => {
  return prevProps.value === nextProps.value &&
    prevProps.error === nextProps.error &&
    prevProps.hint === nextProps.hint &&
    prevProps.disabled === nextProps.disabled
})

export default NumberInput
