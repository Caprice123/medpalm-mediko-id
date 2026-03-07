import Dropdown from '@components/common/Dropdown'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import {
    FormGroup,
    FormLabel,
    LabelWithDescription,
    ErrorMessage,
    FieldImageContainer,
    OptionImage
} from './Detail.styles'
import FieldInput from './FieldInput'
import RadioField from './RadioField'
import CheckboxField from './CheckboxField'

function CalculatorField({ field, value, onChange, error }) {
    return (
        <FormGroup>
            {field.image?.url && (
                <PhotoProvider>
                    <PhotoView src={field.image.url}>
                        <FieldImageContainer>
                            <OptionImage src={field.image.url} alt={field.label} />
                        </FieldImageContainer>
                    </PhotoView>
                </PhotoProvider>
            )}
            <LabelWithDescription>
                <FormLabel>
                    {field.label}
                    {field.unit && <span style={{ color: '#999', fontWeight: '400' }}> ({field.unit})</span>}
                    {field.is_required && <span style={{ color: '#ff6b6b' }}> *</span>}
                </FormLabel>
                {field.description && (
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0', lineHeight: '1.4' }}>
                        {field.description}
                    </p>
                )}
            </LabelWithDescription>

            {field.type === 'multiselect' ? (
                <CheckboxField field={field} value={value} onChange={onChange} />
            ) : field.type === 'dropdown' ? (
                <Dropdown
                    options={field.field_options?.map((opt, idx) => ({
                        value: `${opt.id || idx}_${opt.value}`,
                        label: opt.label,
                        originalValue: opt.value,
                        originalOption: opt
                    })) || []}
                    value={value ? {
                        value: `${value.id || ''}_${value.value}`,
                        label: value.label
                    } : null}
                    onChange={(option) => {
                        if (option) {
                            onChange(field.key, option.originalOption)
                        } else {
                            onChange(field.key, '')
                        }
                    }}
                    placeholder={field.placeholder || `Select ${field.label}`}
                />
            ) : field.type === 'radio' ? (
                <RadioField field={field} value={value} onChange={onChange} />
            ) : (
                <FieldInput
                    field={field}
                    value={value || ''}
                    onChange={onChange}
                />
            )}

            {error && (
                <ErrorMessage>{error}</ErrorMessage>
            )}
        </FormGroup>
    )
}

export default CalculatorField
