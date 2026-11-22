import { memo } from 'react'
import { useSelector } from 'react-redux'
import {
  FaSearch, FaGlobe, FaRegCalendarAlt, FaFilter, FaListOl, FaLanguage, FaSlidersH,
} from 'react-icons/fa'
import Button from '@components/common/Button'
import TextInput from '@components/common/TextInput'
import Textarea from '@components/common/Textarea'
import NumberInput from '@components/common/NumberInput'
import Dropdown from '@components/common/Dropdown'
import { formatJakartaDateLong, localDateInputFormat } from '@utils/dateUtils'
import FilterRow from './components/FilterRow'
import DomainList from './components/DomainList'
import SearchResults from './components/SearchResults'
import { useSearcher } from './hooks/useSearcher'
import {
  Panel, Body, Heading, HeadingIcon, HeadingTitle, HeadingSubtitle,
  FieldHeader, FieldLabel, FieldFormat, Segmented, SegmentedOption, WideSegmented, WideOption,
  RunButtonRow, ResultsSection, ResultsHeader, ResultsTitle,
} from './SearcherPanel.styles'

const LANGUAGE_OPTIONS = [
  { value: 'id', label: 'Bahasa Indonesia' },
  { value: 'en', label: 'Bahasa Inggris' },
]

// The order the browser's own date field expects, read once: it renders in the
// browser's locale while storing yyyy-mm-dd, so dd/mm and mm/dd look identical
// on 1 January and nothing on screen says which was meant.
const DATE_INPUT_FORMAT = localDateInputFormat()

// A focused date field in Chrome takes the mouse wheel as a value change, so
// scrolling the panel with the pointer over one walks the day backwards. Giving
// up focus hands the wheel back to the panel.
const blurOnWheel = (event) => event.currentTarget.blur()

// The chosen date, echoed in words under the field. Picking 1 January and
// seeing 31 December is a one-pixel difference in a dd/mm/yyyy field; spelled
// out, it cannot be misread or shift unnoticed.
const pickedDateHint = (value) => (value ? `Terpilih: ${formatJakartaDateLong(value)}` : '')

const RECENCY_OPTIONS = [
  { value: '', label: 'Tanpa batas waktu' },
  { value: 'day', label: '24 jam terakhir' },
  { value: 'week', label: 'Seminggu terakhir' },
  { value: 'month', label: 'Sebulan terakhir' },
  { value: 'year', label: 'Setahun terakhir' },
]

// The Searcher: journal and web lookups with explicit filters. It replaced the
// research chat tab — the student asks for sources here and writes the prose
// themselves, instead of a model doing both at once.
const SearcherPanel = memo(({ style }) => {
  const {
    form, setField, setValue, toggle, addDomain, removeDomain, canRun, handleRun, view, setView,
  } = useSearcher()
  const isSearching = useSelector(state => state.skripsiV2.loading.isSearching)

  return (
    <Panel style={style}>
      <Body>
        <Heading>
          <HeadingIcon><FaSearch /></HeadingIcon>
          <div>
            <HeadingTitle>Searcher</HeadingTitle>
            <HeadingSubtitle>Cari jurnal dan sumber ilmiah dengan filter yang presisi.</HeadingSubtitle>
          </div>
        </Heading>

        <div>
          <FieldHeader>
            <FieldLabel>Query</FieldLabel>
            <Segmented>
              <SegmentedOption
                type="button"
                $active={form.queryMode === 'single'}
                onClick={() => setValue('queryMode', 'single')}
              >
                Single
              </SegmentedOption>
              <SegmentedOption
                type="button"
                $active={form.queryMode === 'multiple'}
                onClick={() => setValue('queryMode', 'multiple')}
              >
                Multiple
              </SegmentedOption>
            </Segmented>
          </FieldHeader>

          {form.queryMode === 'single' ? (
            <TextInput
              value={form.query}
              onChange={setField('query')}
              placeholder="cari jurnal patogenesis demam berdarah"
              size="small"
            />
          ) : (
            <Textarea
              value={form.queries}
              onChange={setField('queries')}
              placeholder={'satu topik per baris\npatogenesis demam berdarah\ntatalaksana syok dengue'}
              rows={4}
              hint="Maksimal 5 topik sekali jalan."
            />
          )}
        </div>

        <FilterRow
          id="searcher-type"
          icon={<FaGlobe />}
          label="Tipe pencarian"
          checked={form.isTypeEnabled}
          onToggle={toggle('isTypeEnabled')}
        >
          <WideSegmented>
            <WideOption
              type="button"
              $active={form.searchType === 'web'}
              onClick={() => setValue('searchType', 'web')}
            >
              Web
            </WideOption>
            <WideOption
              type="button"
              $active={form.searchType === 'academic'}
              onClick={() => setValue('searchType', 'academic')}
            >
              Akademik
            </WideOption>
          </WideSegmented>
        </FilterRow>

        <FilterRow
          id="searcher-date"
          icon={<FaRegCalendarAlt />}
          label="Filter tanggal"
          checked={form.isDateEnabled}
          onToggle={toggle('isDateEnabled')}
        >
          <Dropdown
            label="Rentang cepat"
            options={RECENCY_OPTIONS}
            value={RECENCY_OPTIONS.find(option => option.value === form.recency) || RECENCY_OPTIONS[0]}
            onChange={(option) => setValue('recency', option?.value || '')}
            isClearable={false}
          />
          <TextInput
            label={<>Terbit setelah<FieldFormat>{DATE_INPUT_FORMAT}</FieldFormat></>}
            type="date"
            value={form.dateFrom}
            onChange={setField('dateFrom')}
            onWheel={blurOnWheel}
            hint={pickedDateHint(form.dateFrom)}
            size="small"
          />
          <TextInput
            label={<>Terbit sebelum<FieldFormat>{DATE_INPUT_FORMAT}</FieldFormat></>}
            type="date"
            value={form.dateTo}
            onChange={setField('dateTo')}
            onWheel={blurOnWheel}
            hint={pickedDateHint(form.dateTo)}
            size="small"
          />
        </FilterRow>

        <FilterRow
          id="searcher-domain"
          icon={<FaFilter />}
          label="Filter domain"
          checked={form.isDomainEnabled}
          onToggle={toggle('isDomainEnabled')}
        >
          <DomainList domains={form.domains} onAdd={addDomain} onRemove={removeDomain} />
        </FilterRow>

        <FilterRow
          id="searcher-limit"
          icon={<FaListOl />}
          label="Batas hasil"
          checked={form.isLimitEnabled}
          onToggle={toggle('isLimitEnabled')}
        >
          <NumberInput
            value={form.maxResults}
            onChange={setField('maxResults')}
            min={1}
            max={20}
            hint="1 sampai 20 hasil."
          />
        </FilterRow>

        <FilterRow
          id="searcher-language"
          icon={<FaLanguage />}
          label="Bahasa"
          checked={form.isLanguageEnabled}
          onToggle={toggle('isLanguageEnabled')}
        >
          <Dropdown
            options={LANGUAGE_OPTIONS}
            value={LANGUAGE_OPTIONS.find(option => option.value === form.language) || LANGUAGE_OPTIONS[0]}
            onChange={(option) => setValue('language', option?.value || 'id')}
            isClearable={false}
          />
        </FilterRow>

        <RunButtonRow>
          <Button variant="primary" fullWidth onClick={handleRun} disabled={!canRun || isSearching}>
            <FaSlidersH /> {isSearching ? 'Mencari...' : 'Jalankan Searcher'}
          </Button>
        </RunButtonRow>
      </Body>

      <ResultsSection>
        <ResultsHeader>
          <ResultsTitle>Hasil</ResultsTitle>
          <Segmented>
            <SegmentedOption type="button" $active={view === 'visual'} onClick={() => setView('visual')}>
              Visual
            </SegmentedOption>
            <SegmentedOption type="button" $active={view === 'json'} onClick={() => setView('json')}>
              {'{ }'}
            </SegmentedOption>
          </Segmented>
        </ResultsHeader>

        <SearchResults view={view} />
      </ResultsSection>
    </Panel>
  )
})

SearcherPanel.displayName = 'SearcherPanel'

export default SearcherPanel
