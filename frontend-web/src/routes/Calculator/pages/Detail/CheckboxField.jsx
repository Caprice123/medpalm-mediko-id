import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
    OptionCard,
    OptionLabel,
    OptionContent,
    OptionImageContainer,
    OptionImage,
    OptionTextContent
} from './Detail.styles'

function CheckboxField({ field, value, onChange }) {
    const selected = Array.isArray(value) ? value : []

    const isChecked = (option) =>
        selected.some(s => s.value === option.value && s.label === option.label)

    const handleToggle = (option) => {
        const already = isChecked(option)
        const next = already
            ? selected.filter(s => !(s.value === option.value && s.label === option.label))
            : [...selected, option]
        onChange(field.key, next)
    }

    const sum = selected.reduce((acc, opt) => acc + (parseFloat(opt.value) || 0), 0)

    return (
        <PhotoProvider>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {field.field_options && field.field_options.map((option, idx) => {
                    const checked = isChecked(option)
                    return (
                        <OptionCard
                            key={option.id || `${idx}_${option.value}`}
                            selected={checked}
                            onClick={() => handleToggle(option)}
                        >
                            <OptionLabel>
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => handleToggle(option)}
                                    style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                                />
                            </OptionLabel>
                            <OptionContent>
                                {option.label && <OptionTextContent>{option.label}</OptionTextContent>}
                                {option.image && (
                                    <PhotoView src={option.image.url}>
                                        <OptionImageContainer>
                                            <OptionImage src={option.image.url} alt={option.label || 'Option image'} />
                                        </OptionImageContainer>
                                    </PhotoView>
                                )}
                            </OptionContent>
                        </OptionCard>
                    )
                })}

                {selected.length > 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', paddingTop: '4px' }}>
                        Total terpilih: <strong style={{ color: '#111827' }}>{sum}</strong>
                    </div>
                )}
            </div>
        </PhotoProvider>
    )
}

export default CheckboxField
