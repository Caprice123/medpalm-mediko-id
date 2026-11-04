import { PiMagnifyingGlass, PiX } from 'react-icons/pi'
import { useSidebarSearchField } from './hooks/useSidebarSearchField'
import { SearchField, SearchGlyph, SearchInput, ClearButton } from './SidebarSearch.styles'

export default function SidebarSearch({ query, onChange, onClear }) {
  const { isFocused, inputRef, handleFocus, handleBlur, handleKeyDown } = useSidebarSearchField(onClear)

  return (
    <SearchField $focused={isFocused}>
      <SearchGlyph $focused={isFocused}><PiMagnifyingGlass /></SearchGlyph>
      <SearchInput
        ref={inputRef}
        placeholder="Cari ringkasan..."
        value={query}
        onChange={e => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {query && (
        <ClearButton onClick={onClear} title="Hapus pencarian" aria-label="Hapus pencarian">
          <PiX />
        </ClearButton>
      )}
    </SearchField>
  )
}
