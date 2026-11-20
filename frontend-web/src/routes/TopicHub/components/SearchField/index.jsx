import { PiMagnifyingGlass, PiX } from 'react-icons/pi'
import Button from '@components/common/Button'
import { Row, Field, SearchInput, SearchIcon, ClearButton } from './SearchField.styles'

/**
 * Shared by the topic hub and the topic detail page. The API does the
 * filtering, so the query is spent on a request only when it is submitted —
 * by the button or by Enter — rather than on every keystroke.
 *
 * @param {string} props.value - what is typed in the field
 * @param {Function} props.onChange - called with the next typed value
 * @param {Function} props.onSubmit - run the typed value as a search
 * @param {Function} props.onClear - empty the field and restore the full list
 * @param {string} props.placeholder - placeholder, doubles as the accessible name
 */
export default function SearchField({ value, onChange, onSubmit, onClear, placeholder }) {
  return (
    <Row>
      <Field>
        <SearchIcon aria-hidden="true"><PiMagnifyingGlass size={16} /></SearchIcon>
        <SearchInput
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onSubmit() }}
          placeholder={placeholder}
          aria-label={placeholder}
        />
        {/* Clearing restores the full list on its own: having emptied the
            field, nobody expects to still have to press Cari to see
            everything again. */}
        {value && (
          <ClearButton type="button" onClick={onClear} aria-label="Hapus pencarian">
            <PiX size={14} />
          </ClearButton>
        )}
      </Field>
      <Button variant="primary" onClick={onSubmit}>Cari</Button>
    </Row>
  )
}
