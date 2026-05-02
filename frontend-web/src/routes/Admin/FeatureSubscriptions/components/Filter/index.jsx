import { useDispatch, useSelector } from 'react-redux'
import { actions } from '@store/featureSubscriptions/reducer'
import { fetchFeatureSubscriptions } from '@store/featureSubscriptions/action'
import FilterComponent from '@components/common/Filter'
import Dropdown from '@components/common/Dropdown'
import TextInput from '@components/common/TextInput'

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'true', label: 'Aktif' },
  { value: 'false', label: 'Tidak Aktif' },
]

export function Filter() {
  const dispatch = useDispatch()
  const filter = useSelector(state => state.featureSubscriptions.filter)
  const appFeatures = useSelector(state => state.feature.features)

  const featureLabels = Object.fromEntries(appFeatures.map(f => [
    ({ skripsi_builder: 'skripsi', osce_practice: 'oscePractice', summary_notes: 'summaryNotes' }[f.sessionType] || f.sessionType), f.name
  ]))
  const featureOptions = [
    { value: '', label: 'Semua Fitur' },
    ...appFeatures.map(f => ({ value: ({ skripsi_builder: 'skripsi', osce_practice: 'oscePractice', summary_notes: 'summaryNotes' }[f.sessionType] || f.sessionType), label: f.name })),
  ]

  const currentFeature = featureOptions.find(o => o.value === (filter.feature ?? '')) || featureOptions[0]
  const currentStatus = statusOptions.find(o => o.value === (filter.isActive !== undefined && filter.isActive !== null ? String(filter.isActive) : '')) || statusOptions[0]

  const handleFeatureChange = (option) => {
    dispatch(actions.updateFilter({ key: 'feature', value: option?.value || undefined }))
    dispatch(fetchFeatureSubscriptions())
  }

  const handleStatusChange = (option) => {
    const val = option?.value
    dispatch(actions.updateFilter({ key: 'isActive', value: val !== '' && val !== undefined ? val : undefined }))
    dispatch(fetchFeatureSubscriptions())
  }

  const handleSearchChange = (e) => {
    dispatch(actions.updateFilter({ key: 'search', value: e.target.value || undefined }))
  }

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') dispatch(fetchFeatureSubscriptions())
  }

  return (
    <FilterComponent>
      <Dropdown
        options={featureOptions}
        value={currentFeature}
        onChange={handleFeatureChange}
        placeholder="Semua Fitur"
      />
      <Dropdown
        options={statusOptions}
        value={currentStatus}
        onChange={handleStatusChange}
        placeholder="Semua Status"
      />
      <TextInput
        placeholder="Cari nama / email user..."
        value={filter.search || ''}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
      />
    </FilterComponent>
  )
}
