import React, { memo } from 'react'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import TagSelector from '@components/common/TagSelector'
import {
  FormGroup,
  FormLabel
} from '../CalculatorModal.styles'

const BasicInfoSection = memo(({
  localTitle,
  localDescription,
  selectedTags,
  categoryTags,
  errors,
  onTitleChange,
  onTitleBlur,
  onDescriptionChange,
  onDescriptionBlur,
  onTagsChange
}) => {
  return (
    <>
      <FormGroup>
        <TextInput
          label="Judul Kalkulator"
          required
          type="text"
          name="title"
          value={localTitle}
          onChange={onTitleChange}
          onBlur={onTitleBlur}
          placeholder="Contoh: Kalkulator BMI, Kalkulator Dosis Obat"
          error={errors.title}
        />
      </FormGroup>

      <FormGroup>
        <Textarea
          label="Deskripsi"
          name="description"
          value={localDescription}
          onChange={onDescriptionChange}
          onBlur={onDescriptionBlur}
          placeholder="Jelaskan fungsi kalkulator ini dan untuk apa digunakan..."
          hint="Opsional - Deskripsi singkat tentang kalkulator"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Kategori</FormLabel>
        <TagSelector
          allTags={categoryTags || []}
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          placeholder="-- Pilih Kategori --"
          helpText="Pilih kategori untuk membantu mengorganisir kalkulator"
        />
      </FormGroup>
    </>
  )
})

BasicInfoSection.displayName = 'BasicInfoSection'

export { BasicInfoSection }
