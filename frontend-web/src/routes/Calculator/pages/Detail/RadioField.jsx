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

function RadioField({ field, value, onChange }) {
    return (
        <PhotoProvider>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {field.field_options && field.field_options.map((option, idx) => {
                    const optionKey = option.id || `${idx}_${option.value}`
                    const isSelected = value && (
                        (option.id && value.id === option.id) ||
                        (value.value === option.value && value.label === option.label)
                    )
                    return (
                        <OptionCard
                            key={optionKey}
                            selected={isSelected}
                            onClick={() => onChange(field.key, option)}
                        >
                            <OptionLabel>
                                <input
                                    type="radio"
                                    name={field.key}
                                    value={optionKey}
                                    checked={isSelected}
                                    onChange={() => onChange(field.key, option)}
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
            </div>
        </PhotoProvider>
    )
}

export default RadioField
