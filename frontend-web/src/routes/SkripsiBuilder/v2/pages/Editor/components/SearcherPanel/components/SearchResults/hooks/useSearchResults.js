import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { saveSetCitation } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { publishYear } from '../utils/resultFields'

const COPIED_FEEDBACK_MS = 2000

// What this list does besides showing results: keep a source for the daftar
// pustaka, copy one citation, and open up a snippet that was cut short.
//
// The confirmation of a copy is the button changing, not a toast: the common
// error channel is the only global message there is, and a success is not an
// error.
export const useSearchResults = () => {
  const dispatch = useDispatch()
  const [copiedUrl, setCopiedUrl] = useState(null)
  const [expandedUrls, setExpandedUrls] = useState([])
  const timerRef = useRef(null)

  const setId = useSelector(state => state.skripsiV2.currentSet?.uniqueId)
  // Which results are already in the report's reference list, so a saved one
  // says so instead of inviting a second save.
  //
  // The array itself is selected and mapped out here rather than mapped inside
  // the selector: a selector that builds a new array on every call has a new
  // result every time the store changes at all, which re-renders this list on
  // every keystroke elsewhere in the editor.
  const citations = useSelector(state => state.skripsiV2.citations)
  const savedUrls = useMemo(
    () => new Set((citations || []).map(citation => citation.url)),
    [citations],
  )

  useEffect(() => () => clearTimeout(timerRef.current), [])

  // The year is part of the citation, not decoration: a reference without one
  // is the first thing a supervisor asks about.
  const copyCitation = async (result) => {
    const published = publishYear(result)
    const citation = published
      ? `${result.title} (${published.year}). ${result.url}`
      : `${result.title}. ${result.url}`

    try {
      await navigator.clipboard.writeText(citation)

      setCopiedUrl(result.url)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopiedUrl(null), COPIED_FEEDBACK_MS)
    } catch {
      dispatch(commonActions.setError('Gagal menyalin sitasi'))
    }
  }

  // Saving is where the metadata lookup happens, so this is the one action here
  // that can take a second or two.
  const saveCitation = (result) => {
    if (!setId) return

    return dispatch(saveSetCitation(setId, {
      title: result.title,
      url: result.url,
      date: result.date || result.lastUpdated || null,
    }))
  }

  const toggleSnippet = (url) => setExpandedUrls(prev => (
    prev.includes(url) ? prev.filter(item => item !== url) : [...prev, url]
  ))

  return {
    copiedUrl,
    copyCitation,
    saveCitation,
    isSaved: (url) => savedUrls.has(url),
    isExpanded: (url) => expandedUrls.includes(url),
    toggleSnippet,
  }
}
