import { useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Loading from '@components/common/Loading'
import { useSearchResults } from './hooks/useSearchResults'
import {
  readableDate, hostnameOf, publishYear, clampSnippet,
} from './utils/resultFields'
import {
  EmptyHint, ResultList, ResultCard, TitleRow, ResultTitle, YearBadge,
  ResultMeta, ResultSnippet, CardActions, RawJson,
} from './SearchResults.styles'

const SearchResults = ({ view }) => {
  const results = useSelector(state => state.skripsiV2.searchResults)
  const raw = useSelector(state => state.skripsiV2.searchRaw)
  const isSearching = useSelector(state => state.skripsiV2.loading.isSearching)
  const {
    copiedUrl, copyCitation, saveCitation, isSaved, isExpanded, toggleSnippet,
  } = useSearchResults()
  const isSavingCitation = useSelector(state => state.skripsiV2.loading.isSavingCitation)

  if (isSearching) return <Loading text="Mencari..." />

  if (results.length === 0) {
    return (
      <EmptyHint>
        Tulis topik, atur filter bila perlu, lalu jalankan Searcher.
      </EmptyHint>
    )
  }

  if (view === 'json') {
    return <RawJson>{JSON.stringify(raw ?? results, null, 2)}</RawJson>
  }

  return (
    <ResultList>
      {results.map((result, index) => {
        const date = readableDate(result.date)
        const updated = date ? null : readableDate(result.lastUpdated)
        const published = publishYear(result)
        const expanded = isExpanded(result.url)
        const snippet = clampSnippet(result.snippet)

        return (
          <ResultCard key={`${result.url}-${index}`}>
            <TitleRow>
              <ResultTitle href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </ResultTitle>

              {published && (
                <YearBadge
                  $muted={!published.isPublished}
                  title={published.isPublished ? 'Tahun publikasi' : 'Tahun pembaruan terakhir'}
                >
                  {published.isPublished ? published.year : `~${published.year}`}
                </YearBadge>
              )}
            </TitleRow>

            <ResultMeta>
              <span>{hostnameOf(result.url)}</span>
              {date && <span>· {date}</span>}
              {updated && <span>· diperbarui {updated}</span>}
            </ResultMeta>

            <ResultSnippet>{expanded ? result.snippet : snippet.text}</ResultSnippet>

            <CardActions>
              <Button
                variant={isSaved(result.url) ? 'secondary' : 'primary'}
                size="small"
                onClick={() => saveCitation(result)}
                disabled={isSavingCitation || isSaved(result.url)}
              >
                {isSaved(result.url) ? 'Di referensi ✓' : 'Simpan ke referensi'}
              </Button>

              <Button variant="secondary" size="small" onClick={() => copyCitation(result)}>
                {copiedUrl === result.url ? 'Tersalin ✓' : 'Salin sitasi'}
              </Button>

              {snippet.isClamped && (
                <Button variant="secondary" size="small" onClick={() => toggleSnippet(result.url)}>
                  {expanded ? 'Ringkas' : 'Selengkapnya'}
                </Button>
              )}
            </CardActions>
          </ResultCard>
        )
      })}
    </ResultList>
  )
}

export default SearchResults
