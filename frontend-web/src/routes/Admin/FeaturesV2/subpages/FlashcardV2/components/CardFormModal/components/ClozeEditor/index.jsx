import Textarea from '@components/common/Textarea'
import TextInput from '@components/common/TextInput'
import Button from '@components/common/Button'
import { referencedClozeNumbers } from '../../../../utils/clozeTokens'
import { Wrapper, FieldLabel, AnswersList, AnswerRow } from './ClozeEditor.styles'

export default function ClozeEditor({ text, onTextChange, answers, onAnswerChange }) {
  const numbers = referencedClozeNumbers(text)
  const nextNumber = numbers.length > 0 ? numbers[numbers.length - 1] + 1 : 1

  return (
    <Wrapper>
      <div>
        <FieldLabel>Teks Cloze *</FieldLabel>
        <Textarea
          value={text}
          onChange={e => onTextChange(e.target.value)}
          placeholder="Contoh: Jantung memiliki {{1}} ruang dan terletak di {{2}}"
          rows={3}
        />
        <Button size="small" onClick={() => onTextChange(`${text || ''}{{${nextNumber}}}`)} style={{ marginTop: '0.375rem' }}>
          {`+ Tambah Blank {{${nextNumber}}}`}
        </Button>
      </div>

      {numbers.length > 0 && (
        <div>
          <FieldLabel>Jawaban per Blank *</FieldLabel>
          <AnswersList>
            {numbers.map(n => (
              <AnswerRow key={n}>
                <span>{`{{${n}}}`}</span>
                <TextInput
                  value={answers[n - 1] || ''}
                  onChange={e => onAnswerChange(n, e.target.value)}
                  placeholder={`Jawaban untuk blank ${n}`}
                />
              </AnswerRow>
            ))}
          </AnswersList>
        </div>
      )}
    </Wrapper>
  )
}
