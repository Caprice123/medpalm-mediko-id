import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { runSkripsiSearch } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

const emptyForm = () => ({
  // 'single' searches one phrase; 'multiple' runs a line per query in one go.
  queryMode: 'single',
  query: '',
  queries: '',
  searchType: 'academic',
  isTypeEnabled: true,
  isDateEnabled: false,
  dateFrom: '',
  dateTo: '',
  recency: '',
  isDomainEnabled: false,
  // Added one at a time rather than typed as one comma-separated string: the
  // list is what will actually be sent, and a typo is visible before running.
  domains: [],
  isLimitEnabled: false,
  maxResults: 10,
  isLanguageEnabled: false,
  language: 'id',
})

const splitList = (value) => value
  .split(/[\n,]/)
  .map(item => item.trim())
  .filter(Boolean)

// The Searcher form. Every filter is off until the student turns it on, so a
// plain search sends nothing but the query — the toggles are what decides which
// parameters reach Perplexity at all.
export const useSearcher = () => {
  const dispatch = useDispatch()

  const [form, setForm] = useState(emptyForm())
  const [view, setView] = useState('visual')

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const setValue = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const toggle = (key) => () => setForm(prev => ({ ...prev, [key]: !prev[key] }))

  const addDomain = (domain) => setForm(prev => ({ ...prev, domains: [...prev.domains, domain] }))

  const removeDomain = (index) => setForm(prev => ({
    ...prev,
    domains: prev.domains.filter((_, i) => i !== index),
  }))

  const queries = form.queryMode === 'single'
    ? splitList(form.query).slice(0, 1)
    : splitList(form.queries)

  const handleRun = async () => {
    if (queries.length === 0) {
      dispatch(commonActions.setError('Tulis dulu yang mau dicari'))
      return
    }

    await dispatch(runSkripsiSearch({
      queries,
      searchType: form.isTypeEnabled ? form.searchType : null,
      maxResults: form.isLimitEnabled ? Number(form.maxResults) : null,
      dateFrom: form.isDateEnabled ? form.dateFrom || null : null,
      dateTo: form.isDateEnabled ? form.dateTo || null : null,
      recency: form.isDateEnabled ? form.recency || null : null,
      domains: form.isDomainEnabled ? form.domains : [],
      // One language, sent as the list the API expects.
      languages: form.isLanguageEnabled && form.language ? [form.language] : [],
    }))
  }

  return {
    form,
    setField,
    setValue,
    toggle,
    addDomain,
    removeDomain,
    canRun: queries.length > 0,
    handleRun,
    view,
    setView,
  }
}
