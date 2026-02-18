import { useState } from 'react'
import TextInput from '@components/common/TextInput'

function FieldInput({ field, value, onChange }) {
    const [localValue, setLocalValue] = useState(value || '')

    return (
        <TextInput
            type={field.type === 'number' ? 'number' : 'text'}
            name={field.key}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onBlur={() => onChange(field.key, localValue)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            step={field.type === 'number' ? 'any' : undefined}
        />
    )
}

export default FieldInput
