import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import Button from '@components/common/Button'
import { useTopicFilterRow } from './hooks/useTopicFilterRow'
import { FilterRow } from './TopicFilterRow.styles'

const CLASSIFICATION_OPTIONS = [
  { value: '', label: 'Semua Klasifikasi' },
  { value: 'sistem_blok', label: 'Sistem Blok' },
  { value: 'ilmu_lintas_sistem', label: 'Ilmu Lintas Sistem' },
]

export default function TopicFilterRow() {
  const { search, setSearch, classification, handleSearch, handleClassificationChange } = useTopicFilterRow()

  return (
    <FilterRow>
      <TextInput
        placeholder="Cari nama topik..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        style={{ flex: 1 }}
      />
      <Dropdown
        options={CLASSIFICATION_OPTIONS}
        value={CLASSIFICATION_OPTIONS.find(o => o.value === classification) ?? CLASSIFICATION_OPTIONS[0]}
        onChange={handleClassificationChange}
        placeholder="Klasifikasi..."
      />
      <Button variant="secondary" onClick={handleSearch}>Cari</Button>
    </FilterRow>
  )
}
