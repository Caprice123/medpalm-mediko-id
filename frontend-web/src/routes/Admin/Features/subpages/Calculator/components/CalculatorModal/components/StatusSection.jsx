import React, { memo } from 'react'
import Dropdown from '@components/common/Dropdown'
import {
  FormRow,
  FormGroup,
  FormLabel,
  HelpText
} from '../CalculatorModal.styles'

const StatusSection = memo(({
  status,
  onFieldChange
}) => {
  return (
    <FormRow>
      <FormGroup>
        <FormLabel>Status</FormLabel>
        <Dropdown
          options={[
            { value: 'draft', label: 'Draft (belum dipublikasi)' },
            { value: 'published', label: 'Published (dapat digunakan user)' }
          ]}
          value={{
            value: status,
            label: status === 'draft' ? 'Draft (belum dipublikasi)' : 'Published (dapat digunakan user)'
          }}
          onChange={(option) => onFieldChange({ target: { name: 'status', value: option.value } })}
        />
        <HelpText>Draft: hanya admin yang bisa lihat. Published: tersedia untuk semua user.</HelpText>
      </FormGroup>
    </FormRow>
  )
})

StatusSection.displayName = 'StatusSection'

export { StatusSection }
