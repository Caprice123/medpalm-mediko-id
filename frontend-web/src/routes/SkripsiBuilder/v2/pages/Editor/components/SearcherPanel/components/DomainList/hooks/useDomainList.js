import { useState } from 'react'

// Trailing slashes, a scheme or a "www." all come back from a copy-paste and
// none of them belong in Perplexity's domain filter.
const normalize = (value) => value
  .trim()
  .toLowerCase()
  .replace(/^https?:\/\//, '')
  .replace(/^www\./, '')
  .replace(/\/.*$/, '')

// The draft row above the list: what is being typed, and what happens when it
// is added. The list itself belongs to the form.
export const useDomainList = ({ domains, onAdd }) => {
  const [draft, setDraft] = useState('')

  const add = () => {
    const domain = normalize(draft)

    // Silently ignoring a duplicate is right here: the row is already visible,
    // so an error message would only restate what the list shows.
    if (!domain || domains.includes(domain)) {
      setDraft('')
      return
    }

    onAdd(domain)
    setDraft('')
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter') return

    event.preventDefault()
    add()
  }

  return {
    draft,
    setDraft: (event) => setDraft(event.target.value),
    canAdd: Boolean(draft.trim()),
    add,
    handleKeyDown,
  }
}
