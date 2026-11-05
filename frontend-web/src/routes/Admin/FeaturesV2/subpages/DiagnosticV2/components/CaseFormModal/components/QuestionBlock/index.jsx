import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import RichTextEditor from '@components/common/RichTextEditor'
import SummaryNoteTreePicker from '@routes/Admin/FeaturesV2/subpages/FlashcardV2/components/CardFormModal/components/SummaryNoteTreePicker'
import {
  FormSection, Label, HelpText, ErrorText,
  OptionContainer, OptionBadge, OptionInput, OptionsList,
  AddOptionButton, RemoveOptionButton,
} from '@routes/Admin/FeaturesV2/subpages/McqV2/components/QuestionFormModal/QuestionFormModal.styles'
import { useQuestionBlock } from './hooks/useQuestionBlock'
import {
  Block, BlockHeader, BlockTitle, CollapseButton,
  AnswerTypeToggle, AnswerTypeButton, RowGroup, InlineRow,
} from './QuestionBlock.styles'

export default function QuestionBlock({
  index, question, errors, canRemove, onRemove,
  onFieldChange, onOptionChange, onAddOption, onRemoveOption,
  onAddReference, onReferenceChange, onRemoveReference,
}) {
  const {
    linkedNotes, removeNote, isSyncingNotes,
    notePickerOpen, setNotePickerOpen, handleSelectNote,
    labelDrafts, setLabelDrafts, commitLabel,
    collapsed, setCollapsed,
  } = useQuestionBlock(question.id)

  const isTextAnswer = question.answerType === 'text'

  return (
    <Block>
      <BlockHeader>
        <BlockTitle>Soal {index + 1}</BlockTitle>
        <CollapseButton type="button" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? 'Buka' : 'Tutup'}
        </CollapseButton>
        {canRemove && (
          <Button size="small" variant="danger" onClick={onRemove}>Hapus Soal</Button>
        )}
      </BlockHeader>

      {!collapsed && (
        <>
          <FormSection>
            <Label>Pertanyaan *</Label>
            <Textarea
              value={question.question}
              onChange={e => onFieldChange('question', e.target.value)}
              placeholder='Contoh: "Apa diagnosis yang paling mungkin?"'
              rows={2}
            />
            {errors[`question-${index}`] && <ErrorText>{errors[`question-${index}`]}</ErrorText>}
          </FormSection>

          <FormSection>
            <Label>Tipe Jawaban *</Label>
            <AnswerTypeToggle>
              <AnswerTypeButton
                type="button"
                $active={!isTextAnswer}
                onClick={() => onFieldChange('answerType', 'multiple_choice')}
              >
                Pilihan Ganda
              </AnswerTypeButton>
              <AnswerTypeButton
                type="button"
                $active={isTextAnswer}
                onClick={() => onFieldChange('answerType', 'text')}
              >
                Isian Teks
              </AnswerTypeButton>
            </AnswerTypeToggle>
          </FormSection>

          {isTextAnswer ? (
            <FormSection>
              <Label>Jawaban Benar *</Label>
              <HelpText style={{ marginBottom: '0.5rem', marginTop: 0 }}>Ditampilkan sebagai kunci jawaban setelah pengguna klik "Lihat Jawaban".</HelpText>
              <Textarea
                value={question.textAnswer}
                onChange={e => onFieldChange('textAnswer', e.target.value)}
                placeholder="Tuliskan jawaban benar di sini..."
                rows={2}
              />
              {errors[`answer-${index}`] && <ErrorText>{errors[`answer-${index}`]}</ErrorText>}
            </FormSection>
          ) : (
            <FormSection>
              <Label>Pilihan Jawaban *</Label>
              <OptionsList>
                {question.options.map((option, i) => (
                  <OptionContainer
                    key={i}
                    $selected={question.correctIndex === i}
                    onClick={() => onFieldChange('correctIndex', i)}
                  >
                    <OptionBadge $selected={question.correctIndex === i}>
                      {String.fromCharCode(65 + i)}
                    </OptionBadge>
                    <OptionInput
                      type="text"
                      value={option}
                      onChange={e => { e.stopPropagation(); onOptionChange(i, e.target.value) }}
                      onClick={e => e.stopPropagation()}
                      placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                    />
                    {question.options.length > 2 && (
                      <RemoveOptionButton type="button" onClick={e => { e.stopPropagation(); onRemoveOption(i) }}>
                        Hapus
                      </RemoveOptionButton>
                    )}
                  </OptionContainer>
                ))}
                <AddOptionButton type="button" onClick={onAddOption}>
                  + Tambah Pilihan
                </AddOptionButton>
              </OptionsList>
              {errors[`options-${index}`] && <ErrorText>{errors[`options-${index}`]}</ErrorText>}
              <HelpText>Klik pada pilihan untuk menjadikannya jawaban benar.</HelpText>
            </FormSection>
          )}

          <FormSection>
            <Label>Penjelasan Singkat (Opsional)</Label>
            <RichTextEditor
              value={question.explanationShort}
              onChange={html => onFieldChange('explanationShort', html)}
              placeholder="Ringkasan yang tampil langsung setelah jawaban terbuka..."
              minHeight="5rem"
              uploadFolder="diagnostic-v2"
            />
          </FormSection>

          <FormSection>
            <Label>Penjelasan Panjang (Opsional)</Label>
            <RichTextEditor
              value={question.explanationLong}
              onChange={html => onFieldChange('explanationLong', html)}
              placeholder='Penjelasan detail, tampil saat pengguna klik "Lihat Penjelasan Panjang"...'
              minHeight="8rem"
              uploadFolder="diagnostic-v2"
            />
          </FormSection>

          {question.id && (
            <FormSection>
              <Label>Modul Terkait (Opsional)</Label>
              <RowGroup>
                {linkedNotes.map(relation => (
                  <InlineRow key={relation.id}>
                    <TextInput
                      value={labelDrafts[relation.id] ?? relation.label ?? ''}
                      onChange={e => setLabelDrafts(d => ({ ...d, [relation.id]: e.target.value }))}
                      onBlur={e => commitLabel(relation, e.target.value.trim())}
                      placeholder="Label (mis. Modul Terkait)"
                    />
                    <TextInput value={relation.targetTitle || ''} disabled />
                    <Button variant="danger" onClick={() => removeNote(relation.id)} disabled={isSyncingNotes}>Hapus</Button>
                  </InlineRow>
                ))}
                <Button onClick={() => setNotePickerOpen(true)} disabled={isSyncingNotes}>+ Tambah Modul Terkait</Button>
              </RowGroup>
            </FormSection>
          )}

          <FormSection>
            <Label>Referensi Soal (Opsional)</Label>
            <RowGroup>
              {question.references.map((ref, i) => (
                <InlineRow key={i}>
                  <TextInput value={ref.label} onChange={e => onReferenceChange(i, 'label', e.target.value)} placeholder="Nama sumber" />
                  <TextInput value={ref.url} onChange={e => onReferenceChange(i, 'url', e.target.value)} placeholder="Link (opsional)" />
                  <Button variant="danger" onClick={() => onRemoveReference(i)}>Hapus</Button>
                </InlineRow>
              ))}
              <Button onClick={onAddReference}>+ Tambah Referensi</Button>
            </RowGroup>
          </FormSection>
        </>
      )}

      {notePickerOpen && (
        <SummaryNoteTreePicker
          onSelect={handleSelectNote}
          onClose={() => setNotePickerOpen(false)}
        />
      )}
    </Block>
  )
}
