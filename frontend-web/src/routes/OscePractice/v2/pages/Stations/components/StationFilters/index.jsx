import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Dropdown from '@components/common/Dropdown'
import { useStationFilters } from './hooks/useStationFilters'
import { Bar, Fields, FilterField, ActiveFilterNote, ClearFilter } from './StationFilters.styles'

// The bar sticks to the top of the viewport, which is the whole reason this list earned its own
// page: when it lived in a panel head, forty rows of catalogue scrolled it away, so changing
// topic meant scrolling back up to the controls first.
//
// The selects deliberately do NOT portal. A portalled react-select menu is positioned `fixed`
// against the viewport from the control's rect at open time, which a sticky ancestor breaks:
// the bar holds still while the page scrolls under it, so the menu detached and landed far
// below its own field. Rendered inline the menu is absolute to its control and simply travels
// with it. Nothing clips it — this bar carries its own surface precisely so it is not inside
// the panel shell's `overflow: hidden` — and the bar's own stacking context keeps the menu
// above the rows it opens over.
function StationFilters() {
  const {
    searchDraft, setSearchDraft, submitSearch,
    topicOptions, batchOptions, applyFilter, clearFilters,
  } = useStationFilters()

  const filter = useSelector((state) => state.oscePracticeV2.filter)
  const isFetching = useSelector((state) => state.oscePracticeV2.loading.isFetchingStations)

  const activeTopic = topicOptions.find((option) => String(option.value) === String(filter.topicTag))
  const activeBatch = batchOptions.find((option) => String(option.value) === String(filter.batchTag))
  const hasFilter = !!filter.topicTag || !!filter.batchTag || !!filter.search

  return (
    <Bar onSubmit={submitSearch}>
      <Fields>
        <FilterField>
          <TextInput
            label="Pencarian"
            placeholder="Cari kasus, keluhan, atau skenario..."
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
        </FilterField>

        <FilterField>
          <Dropdown
            label="Topik"
            options={topicOptions}
            value={activeTopic || null}
            onChange={(option) => applyFilter('topicTag', option?.value || '')}
            placeholder="Semua topik"
            isClearable
          />
        </FilterField>

        <FilterField>
          <Dropdown
            label="Batch"
            options={batchOptions}
            value={activeBatch || null}
            onChange={(option) => applyFilter('batchTag', option?.value || '')}
            placeholder="Semua batch"
            isClearable
          />
        </FilterField>

        <Button type="submit" variant="primary" disabled={isFetching}>
          Cari
        </Button>
      </Fields>

      {hasFilter && (
        <ActiveFilterNote>
          {activeTopic && <>Disaring ke topik <strong>{activeTopic.label}</strong>. </>}
          {activeBatch && <>Batch <strong>{activeBatch.label}</strong>. </>}
          {filter.search && <>Pencarian <strong>{filter.search}</strong>. </>}
          <ClearFilter type="button" onClick={clearFilters}>
            Tampilkan semua
          </ClearFilter>
        </ActiveFilterNote>
      )}
    </Bar>
  )
}

export default StationFilters
